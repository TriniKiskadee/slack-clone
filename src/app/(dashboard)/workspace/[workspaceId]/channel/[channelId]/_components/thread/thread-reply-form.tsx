"use client";

import MessageComposer from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-composer";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import { MessageListItem } from "@/lib/types";
import {
	createMessageSchema,
	CreateMessageSchemaType,
} from "@/schemas/message-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import {
	InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ThreadReplyFormProps {
	threadId: string;
	user: KindeUser<Record<string, unknown>>;
}

const ThreadReplyForm = ({ threadId, user }: ThreadReplyFormProps) => {
	const queryClient = useQueryClient();
	const { channelId } = useParams<{ channelId: string }>();
	const upload = useAttachmentUpload();
	const [editorKey, setEditorKey] = useState<number>(0);

	const form = useForm<CreateMessageSchemaType>({
		resolver: zodResolver(createMessageSchema),
		defaultValues: {
			channelId: channelId,
			threadId: threadId,
			content: "",
		},
	});

	useEffect(() => {
		form.setValue("threadId", threadId);
	}, [threadId, form]);

	const createMessageMutation = useMutation(
		orpc.message.create.mutationOptions({
			onMutate: async (data) => {
				const listOptions = orpc.message.thread.list.queryOptions({
					input: {
						messageId: threadId,
					},
				});

				type MessagePage = {
					items: Array<MessageListItem>;
					nextCursor?: string;
				};

				type InfiniteMessages = InfiniteData<MessagePage>;

				await queryClient.cancelQueries({
					queryKey: listOptions.queryKey,
				});

				const previous = queryClient.getQueryData(listOptions.queryKey);

				const optimistic: MessageListItem = {
					id: `optimistic-${crypto.randomUUID()}`,
					content: data.content,
					createdAt: new Date(),
					updatedAt: new Date(),
					authorId: user.id,
					authorEmail: user.email!,
					authorName: user.given_name ?? "James Bond",
					authorAvatar: getAvatar(user.picture, user.email!),
					channelId: data.channelId,
					threadId: data.threadId!,
					imageUrl: data.imageUrl ?? null,
					replyCount: 0,
					reactions: [],
				};

				queryClient.setQueryData(
					listOptions.queryKey,
					(existingData) => {
						if (!existingData) return existingData;

						return {
							...existingData,
							messages: [...existingData.messages, optimistic],
						};
					},
				);

				toast.loading("Sending reply...", {
					description: "",
					id: "create-reply",
				});

				// Optimistically increase repliesCount in the main message list for the parent message
				queryClient.setQueryData<InfiniteMessages>(
					["message.list", channelId],
					(existingData) => {
						if (!existingData) return existingData;

						const pages = existingData.pages.map((page) => ({
							...page,
							items: page.items.map((message) =>
								message.id === threadId
									? {
											...message,
											replyCount: message.replyCount + 1,
										}
									: message,
							),
						}));

						return {
							...existingData,
							pages,
						};
					},
				);

				return {
					listOptions,
					previous,
				};
			},
			onSuccess: async (_data, _vars, ctx) => {
				await queryClient.invalidateQueries({
					queryKey: ctx.listOptions.queryKey,
				});
				form.reset({ channelId, content: "", threadId });
				upload.clear();
				setEditorKey((key) => key + 1);

				return toast.success("Reply sent successfully.", {
					description: "",
					id: "create-reply",
				});
			},
			onError: (_err, _vars, ctx) => {
				if (!ctx) return;

				const { listOptions, previous } = ctx;
				if (previous) {
					queryClient.setQueryData(listOptions.queryKey, previous);
				}

				toast.error("Oops! Something went wrong!", {
					description: _err.message,
					id: "create-reply",
				});
			},
		}),
	);

	function onSubmit(values: CreateMessageSchemaType) {
		createMessageMutation.mutate({
			...values,
			imageUrl: upload.stagedUrl ?? undefined,
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
									value={field.value}
									onChange={field.onChange}
									upload={upload}
									key={editorKey}
									onSubmit={() => onSubmit(form.getValues())}
									isSubmitting={
										createMessageMutation.isPending
									}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ThreadReplyForm;
