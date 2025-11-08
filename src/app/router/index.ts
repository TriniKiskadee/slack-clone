import {listWorkspaces, createWorkspaces} from "@/app/router/workspace";
import {createChannel, getChannel, listChannels} from "@/app/router/channel";
import {createMessage, listMessage} from "@/app/router/message";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    },
    channel: {
        list: listChannels,
        create: createChannel,
        get: getChannel,
    },
    message: {
        list: listMessage,
        create: createMessage,
    }
}