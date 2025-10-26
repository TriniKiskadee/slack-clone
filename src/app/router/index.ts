import {listWorkspaces, createWorkspaces} from "@/app/router/workspace";
import {createChannel, listChannels} from "@/app/router/channel";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    },
    channel: {
        list: listChannels,
        create: createChannel
    }
}