"use client"

import React from 'react'
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createMessageSchema, CreateMessageSchemaType} from "@/schemas/message-schema";
import MessageComposer
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-composer";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {toast} from "sonner";

interface iMessageInputFormProps {
    channelId: string
}

const MessageInputForm = ({channelId}: iMessageInputFormProps) => {
    const queryClient = useQueryClient();
    const form = useForm<CreateMessageSchemaType>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: ""
        }
    });

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.message.list.key()
                });
                form.reset()
                return toast.success("Message created successfully.", {
                    id: "create-message"
                });

            },
            onError: async (error) => {
                return toast.error("Something went wrong.", {
                    description: error.message,
                    id: "create-message"
                });
            },
        })
    )

    function onSubmit(values: CreateMessageSchemaType) {
        createMessageMutation.mutate(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name={"content"}
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <MessageComposer
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSubmit={() => onSubmit(form.getValues())}
                                    isSubmitting={createMessageMutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
export default MessageInputForm
