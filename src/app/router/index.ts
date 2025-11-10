import {listWorkspaces, createWorkspaces} from "@/app/router/workspace";
import {createChannel, getChannel, listChannels} from "@/app/router/channel";
import {createMessage, listMessage, updateMessage} from "@/app/router/message";
import {inviteMember, listMembers} from "@/app/router/member";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
        member: {
            invite: inviteMember,
            list: listMembers,
        }
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
    },
}