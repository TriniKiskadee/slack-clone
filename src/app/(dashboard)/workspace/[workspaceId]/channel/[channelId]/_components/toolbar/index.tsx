import React from 'react'
import {Button} from "@/components/ui/button";
import {MessageSquareTextIcon, PencilIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useThread} from "@/providers/thread-provider";

interface ToolbarProps {
    messageId: string;
    canEdit: boolean;
    onEdit: () => void;
}

const MessageHoverToolbar = ({messageId, canEdit, onEdit}: ToolbarProps) => {
    const {toggleThread} = useThread()

    return (
        <TooltipProvider>
            <div className={"absolute -right-2 -top-3 items-center gap-1 rounded-md border border-gray-200 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blue transition-opacity opacity-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90"}>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        {canEdit && (
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={onEdit}
                            >
                                <PencilIcon className={"size-4"} />
                            </Button>
                        )}
                    </TooltipTrigger>
                    <TooltipContent side={"top"}>
                        <p>
                            Update
                        </p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => toggleThread(messageId)}
                        >
                            <MessageSquareTextIcon className={"size-4"} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={"top"}>
                        <p>
                            Reply
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
export default MessageHoverToolbar