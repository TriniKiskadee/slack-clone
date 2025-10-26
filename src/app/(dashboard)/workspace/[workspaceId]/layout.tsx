import React, {PropsWithChildren} from 'react'
import WorkspaceHeader from "@/app/(dashboard)/workspace/[workspaceId]/_components/workspace-header";
import CreateNewChannel from "@/app/(dashboard)/workspace/[workspaceId]/_components/create-new-channel";

const ChannelListLayout = ({children}: PropsWithChildren) => {
    return (
        <>
            <div className={"flex h-full w-80 flex-col bg-secondary border-r border-border"}>
                <div className={"flex items-center px-4 h-14 border-b border-border"}>
                    <WorkspaceHeader />
                </div>
                <div className={"px-4 py-2"}>
                    <CreateNewChannel />
                </div>
            </div>
            {children}
        </>
    )
}
export default ChannelListLayout
