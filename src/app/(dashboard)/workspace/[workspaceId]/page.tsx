import React from 'react'
import {client} from "@/lib/orpc";
import {redirect} from "next/navigation";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {Button} from "@/components/ui/button";
import {SpeechIcon} from "lucide-react";
import CreateNewChannel from "@/app/(dashboard)/workspace/[workspaceId]/_components/create-new-channel";
import EmptyState from "@/components/general/empty-state";

interface iWorkspaceIdPageProps {
    params: Promise<{workspaceId: string}>
}

const WorkspaceIdPage = async ({params}: iWorkspaceIdPageProps) => {
    const {workspaceId} = await params
    const {channels} = await client.channel.list()


    if (channels.length > 0) {
        return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`)
    }

    return (
        <div className={"flex flex-1 p-16"}>
            <EmptyState
                title={"No channels yet!"}
                description={"Create your first channel to get started!"}
                icon={SpeechIcon}
                customButton={CreateNewChannel}
                buttonText={""}
            />
            {/*<Empty className="border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SpeechIcon />
                    </EmptyMedia>
                    <EmptyTitle>
                        No channels yet!
                    </EmptyTitle>
                    <EmptyDescription>
                        Create your first channel to get started!
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className={"max-w-xs mx-auto"}>
                    <CreateNewChannel />
                </EmptyContent>
            </Empty>*/}
        </div>
    )
}
export default WorkspaceIdPage
