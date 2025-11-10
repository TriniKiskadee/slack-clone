import React from "react";
import {AnimatedThemeToggler} from "@/components/ui/animated-theme-toggler";
import {Skeleton} from "@/components/ui/skeleton";
import InviteMember
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/member/invite-member";
import MembersOverview
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/member/members-overview";

interface ChannelHeaderProps {
    channelName: string | undefined;
}

const ChannelHeader = ({channelName}: ChannelHeaderProps) => {

    return (
        <div className={"flex items-center justify-between h-14 px-4 border-b"}>
            <h1 className={"text-lg font-semibold"}>
                {channelName ? (
                    `#${channelName}`
                ) : (
                    <Skeleton className={"w-[300px] h-6"} />
                )}
            </h1>
            <div className={"flex items-center space-x-3"}>
                <MembersOverview />
                <InviteMember />
                <AnimatedThemeToggler
                    className={"border-[1px] bg-secondary text-black dark:bg-[#0A0A0A] dark:text-white dark:hover:bg-primary"}
                />
            </div>
        </div>
    );
};
export default ChannelHeader;
