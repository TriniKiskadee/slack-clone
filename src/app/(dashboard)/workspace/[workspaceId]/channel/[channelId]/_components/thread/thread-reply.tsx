import React from "react";
import Image from "next/image";
import { formatDateWithOrdinal } from "@/lib/utils";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/generated/prisma/client";
import SafeContent from "@/components/rich-text-editor/safe-content";
import ReactionsBar from "../messages/reactions/reactions-bar";
import { MessageListItem } from "@/lib/types";

interface ThreadReplyProps {
	message: MessageListItem;
	selectedThreadId: string;
}

const ThreadReply = ({ message, selectedThreadId }: ThreadReplyProps) => {
	return (
		<div className={"flex space-x-3 p-3 hover:bg-muted/30 rounded-lg"}>
			<Image
				src={getAvatar(message.authorAvatar, message.authorEmail)}
				alt={"Author Avatar"}
				width={32}
				height={32}
				className={"size-8 rounded-full shrink-0"}
			/>
			<div className={"flex-1 space-y-1 min-w-0"}>
				<div className={"flex items-center space-x-2"}>
					<span className={"font-medium text-sm"}>
						{message.authorName}
					</span>
					<span className={"text-xs text-muted-foreground"}>
						{formatDateWithOrdinal(message.createdAt)}
					</span>
				</div>
				<SafeContent
					content={JSON.parse(message.content)}
					className={
						"text-sm break-words prose dark:prose-invert max-w-none marker:text-primary"
					}
				/>

				{message.imageUrl && (
					<div className={"mt-2"}>
						<Image
							src={message.imageUrl}
							alt={"Message attachment"}
							width={512}
							height={512}
							className={
								"rounded-md max-h-[320px] w-auto object-contain"
							}
						/>
					</div>
				)}

				<ReactionsBar
					reactions={message.reactions}
					messageId={message.id}
					context={{ type: "thread", threadId: selectedThreadId }}
				/>
			</div>
		</div>
	);
};
export default ThreadReply;
