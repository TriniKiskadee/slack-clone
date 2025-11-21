"use client";

import * as React from "react";
import EmojiReaction from "./emoji-reaction";
import {
	InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { GroupedReactionSchemaType } from "@/schemas/message-schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { MessageListItem } from "@/lib/types";
import { Slabo_13px } from "next/font/google";

type ThreadContext = {
	type: "thread";
	threadId: string;
};
type ListContext = {
	type: "list";
	channelId: string;
};

interface ReactionsBarProps {
	messageId: string;
	reactions: GroupedReactionSchemaType[];
	context?: ThreadContext | ListContext;
}

type MessagePage = {
	items: MessageListItem[];
	nextCursor?: string;
};
type InfiniteReplies = InfiniteData<MessagePage>;

const ReactionsBar = ({ messageId, reactions, context }: ReactionsBarProps) => {
	const { channelId } = useParams<{ channelId: string }>();
	const queryClient = useQueryClient();

	const toggleMutation = useMutation(
		orpc.message.reaction.toggle.mutationOptions({
			onMutate: async (vars: { messageId: string; emoji: string }) => {
				const bump = (reactions: GroupedReactionSchemaType[]) => {
					const found = reactions.find(
						(reaction) => reaction.emoji === vars.emoji,
					);
					if (found) {
						const dec = found.count - 1;
						return dec <= 0
							? reactions.filter(
									(reaction) =>
										reaction.emoji !== found.emoji,
								)
							: reactions.map((reaction) =>
									reaction.emoji === found.emoji
										? {
												...reaction,
												count: dec,
												reactedByMe: false,
											}
										: reaction,
								);
					}

					return [
						...reactions,
						{
							emoji: vars.emoji,
							count: 1,
							reactedByMe: true,
						},
					];
				};

				const isThread = context && context.type === "thread";

				if (isThread) {
					const listOptions = orpc.message.thread.list.queryOptions({
						input: {
							messageId: context.threadId,
						},
					});

					await queryClient.cancelQueries({
						queryKey: listOptions.queryKey,
					});

					const previousThread = queryClient.getQueryData(
						listOptions.queryKey,
					);

					queryClient.setQueryData(
						listOptions.queryKey,

						(existingData) => {
							if (!existingData) return existingData;

							if (vars.messageId === context.threadId) {
								return {
									...existingData,
									parent: {
										...existingData.parent,
										reactions: bump(
											existingData.parent.reactions,
										),
									},
								};
							}

							return {
								...existingData,
								messages: existingData.messages.map(
									(message) =>
										message.id === vars.messageId
											? {
													...message,
													reactions: bump(
														message.reactions,
													),
												}
											: message,
								),
							};
						},
					);

					return {
						previousThread,
						threadQueryKey: listOptions.queryKey,
					};
				}

				const listKey = ["message.list", channelId];
				await queryClient.cancelQueries({
					queryKey: listKey,
				});

				const previousData = queryClient.getQueryData(listKey);

				queryClient.setQueryData<InfiniteReplies>(
					listKey,
					(existingData) => {
						if (!existingData) return existingData;

						const pages = existingData.pages.map((page) => ({
							...page,
							items: page.items.map((message) => {
								if (message.id !== messageId) return message;

								const current = message.reactions;

								return {
									...message,
									reactions: bump(current),
								};
							}),
						}));

						return {
							...existingData,
							pages,
						};
					},
				);

				toast.loading("Updating emoji...", {
					id: "emoji-toggle",
					description: "",
				});

				return {
					previousData,
					listKey,
				};
			},
			onSuccess: () => {
				return toast.success("Updated emoji!", {
					id: "emoji-toggle",
					description: "",
				});
			},
			onError: (_err, _var, ctx) => {
				if (ctx?.threadQueryKey && ctx.previousThread) {
					queryClient.setQueryData(
						ctx.threadQueryKey,
						ctx.previousData,
					);
				}
				if (ctx?.previousData && ctx.listKey) {
					queryClient.setQueryData(ctx.listKey, ctx.previousData);
				}

				return toast.error("Oops! Something went wrong!", {
					id: "emoji-toggle",
					description: _err.message,
				});
			},
		}),
	);

	const handleToggle = (emoji: string) => {
		toggleMutation.mutate({ emoji, messageId });
	};

	return (
		<div className={"group mt-1 flex items-center gap-1"}>
			{reactions?.map((reaction) => (
				<Button
					key={reaction.emoji}
					type={"button"}
					variant={"secondary"}
					size={"sm"}
					className={cn(
						"h-6 px-2 text-xs rounded-full justify-center",
						reaction.reactedByMe &&
							"bg-primary/10 border border-primary",
					)}
					onClick={() => handleToggle(reaction.emoji)}
				>
					<span>{reaction.emoji}</span>
					<span>{reaction.count}</span>
				</Button>
			))}
			<EmojiReaction onSelect={handleToggle} />
		</div>
	);
};

export default ReactionsBar;

// TODO: 11:33:46
