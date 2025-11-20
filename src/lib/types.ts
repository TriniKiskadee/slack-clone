import { Message } from "@/generated/prisma/client";
import { GroupedReactionSchemaType } from "@/schemas/message-schema";

export type MessageListItem = Message & {
	replyCount: number;
	reactions: GroupedReactionSchemaType[];
};
