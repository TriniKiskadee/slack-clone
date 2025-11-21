import { listWorkspaces, createWorkspaces } from "@/app/router/workspace";
import { createChannel, getChannel, listChannels } from "@/app/router/channel";
import {
	createMessage,
	listMessage,
	listThreadReplies,
	toggleReaction,
	updateMessage,
} from "@/app/router/message";
import { inviteMember, listMembers } from "@/app/router/member";
import { generateCompose, generateThreadSummary } from "./ai";

export const router = {
	workspace: {
		list: listWorkspaces,
		create: createWorkspaces,
		member: {
			invite: inviteMember,
			list: listMembers,
		},
	},
	channel: {
		list: listChannels,
		create: createChannel,
		get: getChannel,
	},
	message: {
		list: listMessage,
		create: createMessage,
		update: updateMessage,
		reaction: {
			toggle: toggleReaction,
		},
		thread: {
			list: listThreadReplies,
		},
	},
	ai: {
		compose: {
			generate: generateCompose,
		},
		thread: {
			summary: {
				generate: generateThreadSummary,
			},
		},
	},
};
