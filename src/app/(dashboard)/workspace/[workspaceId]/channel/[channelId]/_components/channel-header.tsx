import React from 'react'
import {AnimatedThemeToggler} from "@/components/ui/animated-theme-toggler";

const ChannelHeader = () => {
    return (
        <div className={"flex items-center justify-between h-14 px-4 border-b"}>
            <h1 className={"text-lg font-semibold"}>
                # generic-channel-name
            </h1>
            <div className={"flex items-center space-x-2"}>
                <AnimatedThemeToggler />
            </div>
        </div>
    )
}
export default ChannelHeader
