import {listWorkspaces, createWorkspaces} from "@/app/router/workspace";
import {createChannel, listChannels} from "@/app/router/channel";
import {createMessage, listMessage} from "@/app/router/message";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    },
    channel: {
        list: listChannels,
        create: createChannel
    },
    message: {
        list: listMessage,
        create: createMessage
    }
}