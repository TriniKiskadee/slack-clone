"use client"

import React, {useState} from 'react'
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
import {PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {workspaceSchema, workspaceSchemaType} from "@/schemas/workspace-schema";
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";

const CreateWorkspace = () => {
    const [open, setOpen] = useState<boolean>(false)

    const form = useForm<workspaceSchemaType>({
        resolver: zodResolver(workspaceSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
        }
    });

    function onSubmit(values: workspaceSchemaType) {
        toast.success("Created workspace!",{
            description: JSON.stringify(values, null, 2),
        });
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
                        <FormField
                            control={form.control}
                            name={"description"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                        <span className={"text-primary text-xs"}>
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={"Discussion space for backend architecture and deployments"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>
                            Create Workspace
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateWorkspace
