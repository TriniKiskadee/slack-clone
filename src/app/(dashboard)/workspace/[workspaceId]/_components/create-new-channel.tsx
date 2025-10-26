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
import {channelSchema, channelSchemaType, transformChannelName} from "@/schemas/channel-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {isDefinedError} from "@orpc/client";

const CreateNewChannel = () => {
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient();

    const form = useForm<channelSchemaType>({
        resolver: zodResolver(channelSchema),
        defaultValues: {
            name: ""
        },
        mode: "onBlur"
    })

    const createChannelMutation = useMutation(
        orpc.channel.create.mutationOptions({
            onSuccess: (newChannel) => {
                toast.success(`Channel ${newChannel.name} created successfully!`, {
                    id: "channel-created"
                })
                queryClient.invalidateQueries({
                    queryKey: orpc.channel.list.queryKey()
                })
                form.reset()
                setOpen(false)
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    toast.error(error.message, {
                        id: "channel-created"
                    })
                    return
                }
                toast.error("Failed to create channel. Please try again.", {
                    id: "channel-created"
                })
            },
            onMutate: () => {
                toast.loading("Creating channel...", {
                    id: "channel-created"
                })
            }
        })
    )

    // reset form on Dialog close
    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    function onSubmit(values: channelSchemaType) {
        createChannelMutation.mutate(values)
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
                            disabled={createChannelMutation.isPending}
                            className={"h-10 px-4 flex items-center justify-center"}
                        >
                            {createChannelMutation.isPending ? (
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