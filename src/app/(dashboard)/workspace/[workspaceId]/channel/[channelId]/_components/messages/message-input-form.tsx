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

interface iMessageInputFormProps {
    channelId: string;
}

const MessageInputForm = ({ channelId }: iMessageInputFormProps) => {
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
