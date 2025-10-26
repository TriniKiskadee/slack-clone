"use client"

import React, {useEffect, useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Loader2, PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {workspaceSchema, workspaceSchemaType} from "@/schemas/workspace-schema";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {isDefinedError} from "@orpc/client";

const CreateWorkspace = () => {
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient();

    const form = useForm<workspaceSchemaType>({
        resolver: zodResolver(workspaceSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
        }
    });

    // reset form on Dialog close
    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    const createWorkspaceMutation = useMutation(
        orpc.workspace.create.mutationOptions({
            onSuccess: (newWorkspace) => {
                toast.success("Success", {
                    description: `Workspace "${newWorkspace.workspaceName}" has been created successfully.`,
                    id: "create-workspace"
                })

                queryClient.invalidateQueries({
                    queryKey: orpc.workspace.list.queryKey(),
                })

                form.reset()
                setOpen(false)
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    if (error.code === "RATE_LIMITED") {
                        toast.error(error.message, {
                            description: "",
                            id: "create-workspace"
                        })
                        return
                    }

                    toast.error(error.message, {
                        description: "",
                        id: "create-workspace"
                    })
                    return
                }
                toast.error("Oops, something went wrong", {
                    description: `Failed to create your workspace. Please try again.`,
                    id: "create-workspace"
                })
            },
            onMutate: () => {
                toast.loading("Creating workspace...", {
                    id: "create-workspace"
                })
            }
        })
    )

    function onSubmit(values: workspaceSchemaType) {
        createWorkspaceMutation.mutate(values)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={"size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200 cursor-pointer"}
                        >
                            <PlusIcon className={"size-5"}/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side={"right"}>
                    <p>
                        Create workspace
                    </p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className={"sm:max-w-[425px]"}>
                <DialogHeader>
                    <DialogTitle>
                        Create Workspace
                    </DialogTitle>
                    <DialogDescription>
                        Create a new workspace to get started
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={"space-y-6"}
                    >
                        <FormField
                            control={form.control}
                            name={"name"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                        <span className={"text-rose-600"}>
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"Engineering Team"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type={"submit"}
                            disabled={createWorkspaceMutation.isPending}
                            className={"h-10 px-4 flex items-center justify-center"}
                        >
                            {createWorkspaceMutation.isPending ? (
                                <div className={"flex items-center justify-center mx-4 gap-2"}>
                                    <Loader2 className={"h-8 animate-spin duration-300"}/>
                                    <span>
                                        Creating...
                                    </span>
                                </div>
                            ) : (
                                <p>
                                    Create Workspace
                                </p>
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateWorkspace
