import React from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

// TODO: get workspace data from db
const workspaces = [
    {
        id: "1",
        name: "TeamFlow 1",
        avatar: "TF",
    },
    {
        id: "2",
        name: "TeamFlow 2",
        avatar: "TF 2",
    },
    {
        id: "3",
        name: "TeamFlow 3",
        avatar: "TF 3",
    },
]

const colorCombos = [
    "bg-blue-500 hover:bg-blue-600 text-white",
    "bg-purple-500 hover:bg-purple-600 text-white",
    "bg-green-500 hover:bg-green-600 text-white",
    "bg-red-500 hover:bg-rose-600 text-white",
    "bg-orange-500 hover:bg-orange-600 text-white",
    "bg-pink-500 hover:bg-pink-600 text-white",
    "bg-teal-500 hover:bg-teal-600 text-white",
    "bg-indigo-500 hover:bg-indigo-600 text-white",
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
    "bg-cyan-500 hover:bg-cyan-600 text-white",
    "bg-emerald-500 hover:bg-emerald-600 text-white",
]

const getWorkspaceColor = (id: string) => {
    const charSum = id
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0)

    const colorIndex = charSum % colorCombos.length
    return colorCombos[colorIndex]
}

const WorkspaceList = () => {
    return (
        <TooltipProvider>
            <div className={"flex flex-col gap-2"}>
                {workspaces.map((workspace) => (
                    <Tooltip key={workspace.id}>
                        <TooltipTrigger asChild>
                            <Button
                                size={"icon"}
                                className={cn(
                                    "size-12 transition-all duration-200 cursor-pointer",
                                    getWorkspaceColor(workspace.id)
                                )}
                            >
                                <span className={"text-sm font-semibold"}>
                                    {workspace.avatar}
                                </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side={"right"}>
                            <p>
                                {workspace.name}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}
export default WorkspaceList
