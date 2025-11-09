"use client";

import React, {useState} from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMessageSchema, CreateMessageSchemaType } from "@/schemas/message-schema";
import MessageComposer from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-composer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import {useAttachmentUpload} from "@/hooks/use-attachment-upload";
import {Message} from "@/generated/prisma/client";
import {InfiniteData} from "@tanstack/react-query";
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs";
import {getAvatar} from "@/lib/get-avatar";

interface iMessageInputFormProps {
    channelId: string;
    user: KindeUser<Record<string, unknown>>
}

type MessagePage = {
    items: Message[]
    nextCursor?: string;
}
type InfiniteMessages = InfiniteData<MessagePage>

const MessageInputForm = ({ channelId, user }: iMessageInputFormProps) => {
    const queryClient = useQueryClient();
    const [editorKey, setEditorKey] = useState<number>(0)
    const upload = useAttachmentUpload()

    const form = useForm<CreateMessageSchemaType>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: "",
        },
    });

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onMutate: async (data) => {
                await queryClient.cancelQueries({
                    queryKey: ["message.list", channelId],
                })

                const previousData = queryClient.getQueryData<InfiniteMessages>([
                    "message.list",
                    channelId,
                ])

                const tempId = `optimistic-${crypto.randomUUID()}`

                const optimisticMessage: Message = {
                    id: tempId,
                    content: data.content,
                    imageUrl: data.imageUrl ?? null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    authorId: user.id,
                    authorEmail: user.email!,
                    authorName: user.given_name || "John Doe",
                    authorAvatar: getAvatar(user.picture, user.email!),
                    channelId: channelId,
                }

                queryClient.setQueryData<InfiniteMessages>(
                    ["message.list", channelId],
                    (existingData) => {
                        if (!existingData) {
                            return {
                                pages: [
                                    {
                                        items: [optimisticMessage],
                                        nextCursor: undefined,
                                    },
                                ],
                                pageParams: [undefined],
                            } satisfies InfiniteMessages
                        }

                        const firstPage = existingData.pages[0] ?? {
                            items: [],
                            nextCursor: undefined,
                        }

                        const updatedFirstPage: MessagePage = {
                            ...firstPage,
                            items: [optimisticMessage, ...firstPage.items],
                        }

                        return {
                            ...existingData,
                            pages: [updatedFirstPage, ...existingData.pages.slice(1)],
                        }
                    }
                )

                return {
                    prevData: previousData,
                    tempId,
                }

                /* TODO: 2:40:26 */
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: orpc.message.list.key(),
                });
                form.reset({
                    channelId: channelId,
                    content: ""
                });
                upload.clear()
                setEditorKey((key) => key + 1)
                // return toast.success("Message created successfully.", {
                //     id: "create-message"
                // });
            },
            onError: async (error) => {
                return toast.error("Something went wrong.", {
                    description: error.message,
                    id: "create-message",
                });
            },
        }),
    );

    function onSubmit(values: CreateMessageSchemaType) {
        createMessageMutation.mutate({
            ...values,
            imageUrl: upload.stagedUrl ?? undefined
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name={"content"}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <MessageComposer
                                    key={editorKey}
                                    value={field.value}
                                    upload={upload}
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
    );
};
export default MessageInputForm;
