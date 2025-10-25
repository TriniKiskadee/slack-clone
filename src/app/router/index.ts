import {listWorkspaces, createWorkspaces} from "@/app/router/workspace";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspaces,
    }
}