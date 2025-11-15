import React from 'react'
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateMessageSchema, UpdateMessageSchemaType} from "@/schemas/message-schema";
import RichTextEditor from "@/components/rich-text-editor/editor";
import {Button} from "@/components/ui/button";
import {Message} from "@/generated/prisma/client";
import {toast} from "sonner";
import {InfiniteData, useMutation, useQueryClient} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";

interface EditMessageProps {
    message: Message
    onCancel: () => void
    onSave: () => void
}

const EditMessage = ({message, onCancel, onSave}: EditMessageProps) => {
    const queryClient = useQueryClient();

    const form = useForm<UpdateMessageSchemaType>({
        resolver: zodResolver(updateMessageSchema),
        defaultValues: {
            messageId: message.id,
            content: message.content,
        }
    })

    const updateMessageMutation = useMutation(
        orpc.message.update.mutationOptions({
            onMutate: () => {
                toast.loading("Saving your changes...", {
                    description: "",
                    id: `edit-message-${message.id}`,
                });
            },
            onSuccess: (updated) => {
                type MessagePage = {
                    items: Message[]
                    nextCursor?: string
                }
                type InfiniteMessages = InfiniteData<MessagePage>

                queryClient.setQueryData<InfiniteMessages>(
                    ["message.list", message.channelId],
                    (existingData) => {
                        if (!existingData) return existingData

                        const updatedMessage = updated.message

                        const pages = existingData.pages.map((page) => ({
                            ...page,
                            items: page.items.map((message) => message.id === updatedMessage.id ? {
                                ...message,
                                ...updatedMessage
                            } : message),
                        }))

                        return {
                            ...existingData,
                            pages,
                        }
                    }
                )
                toast.success("Message Updated successfully!", {
                    description: "",
                    id: `edit-message-${message.id}`,
                })
                onSave()
            },
            onError: error => {
                toast.error("Oops! Something went wrong...", {
                    description: error.message,
                    id: `edit-message-${message.id}`,
                });
            }
        })
    )

    function onSubmit(values: UpdateMessageSchemaType) {
        updateMessageMutation.mutate(values)
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
                                <RichTextEditor
                                    field={field}
                                    sendButton={
                                        <div className={"flex items-center gap-3"}>
                                            <Button
                                                type={"button"}
                                                size={"sm"}
                                                variant={"outline"}
                                                onClick={onCancel}
                                                disabled={updateMessageMutation.isPending}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type={"submit"}
                                                size={"sm"}
                                                disabled={updateMessageMutation.isPending}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    }
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
export default EditMessage

/* TODO: 4:33:16 */