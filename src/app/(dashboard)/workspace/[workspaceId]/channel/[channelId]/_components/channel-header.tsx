import React from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const ChannelHeader = () => {
    return (
        <div className={"flex items-center justify-between h-14 px-4 border-b"}>
            <h1 className={"text-lg font-semibold"}># generic-channel-name</h1>
            <div className={"flex items-center space-x-2"}>
                <AnimatedThemeToggler
                    className={
                        "bg-white border-[1px] border-black text-black dark:bg-[#0A0A0A] dark:border-[1px] dark:border-white dark:text-white"
                    }
                />
            </div>
        </div>
    );
};
export default ChannelHeader;
