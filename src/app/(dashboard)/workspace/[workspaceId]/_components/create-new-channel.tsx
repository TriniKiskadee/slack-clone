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
import {Button} from "@/components/ui/button";
import {Loader2, PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {ChannelSchema, channelSchemaType, transformChannelName} from "@/schemas/channel-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {workspaceSchemaType} from "@/schemas/workspace-schema";
import {toast} from "sonner";

const CreateNewChannel = () => {
    const [open, setOpen] = useState<boolean>(false)

    const form = useForm<channelSchemaType>({
        resolver: zodResolver(ChannelSchema),
        defaultValues: {
            name: ""
        },
        mode: "onBlur"
    })

    // reset form on Dialog close
    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    function onSubmit(values: workspaceSchemaType) {
        /*if (createWorkspaceMutation.isPending) {
            toast.loading("Creating your workspace...", {
                id: "create-workspace",
            })
        }
        createWorkspaceMutation.mutate(values)*/
    }

    const watchedName = form.watch("name")
    const transformedName = watchedName ? transformChannelName(watchedName) : ""

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className={"w-full"}
                >
                    <PlusIcon className={"size-4"}/>
                    Add Channel
                </Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
                <DialogHeader>
                    <DialogTitle>
                        Create Channel
                    </DialogTitle>
                    <DialogDescription>
                        Create a new channel to get started!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className={"space-y-6"}
                        onSubmit={form.handleSubmit(onSubmit)}
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
                                            placeholder={"Product Launch Chat"}
                                            {...field}
                                        />
                                    </FormControl>
                                    {transformedName && transformedName !== watchedName && (
                                        <p className={"text-sm text-muted-foreground"}>
                                            Will be created as:{" "}
                                            <code className={"bg-muted px-1 py-0.5 rounded text-xs"}>
                                                {transformedName}
                                            </code>
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type={"submit"}
                            disabled={true} // TODO: get isPending from oRPC
                            className={"h-10 px-4 flex items-center justify-center"}
                        >
                            {/* TODO: get isPending from oRPC*/}
                            {false ? (
                                <div className={"flex items-center justify-center mx-4 gap-2"}>
                                    <Loader2 className={"h-8 animate-spin duration-300"}/>
                                    <span>
                                        Creating...
                                    </span>
                                </div>
                            ) : (
                                <p>
                                    Create Channel
                                </p>
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateNewChannel

/*TODO: 6:20:28*/