import React from "react";
import {AnimatedThemeToggler} from "@/components/ui/animated-theme-toggler";
import {Skeleton} from "@/components/ui/skeleton";

interface ChannelHeaderProps {
    channelName?: string;
}

const ChannelHeader = ({channelName}: ChannelHeaderProps) => {

    return (
        <div className={"flex items-center justify-between h-14 px-4 border-b"}>
            <h1 className={"text-lg font-semibold"}>
                {channelName ? (
                    `# ${channelName}`
                ) : (
                    <Skeleton className={"w-[300px] h-6"} />
                )}
            </h1>
            <div className={"flex items-center space-x-2"}>
                <AnimatedThemeToggler
                    className={"border-[1px] bg-secondary text-black dark:bg-[#0A0A0A] dark:text-white dark:hover:bg-primary"}
                />
            </div>
        </div>
    );
};
export default ChannelHeader;
