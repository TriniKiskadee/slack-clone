import React, {PropsWithChildren} from 'react'
import WorkspaceList from "@/app/(dashboard)/workspace/_components/workspace-list";
import CreateWorkspace from "@/app/(dashboard)/workspace/_components/create-workspace";
import {Separator} from "@/components/ui/separator";
import UserNav from "@/app/(dashboard)/workspace/_components/user-nav";

const WorkspaceLayout = ({children}: PropsWithChildren) => {
    return (
        <div className={"flex w-full h-screen"}>
            <div className={"flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border"}>
                <WorkspaceList />
                <Separator className={"mt-4"} />
                <div className={"mt-4"}>
                    <CreateWorkspace />
                </div>
                <div className={"mt-auto"}>
                    <UserNav />
                </div>
            </div>
            {children}
        </div>
    )
}
export default WorkspaceLayout
