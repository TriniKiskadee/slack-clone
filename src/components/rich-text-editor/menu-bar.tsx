import React from 'react'
import {Editor, useEditorState} from "@tiptap/react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {
    BoldIcon,
    CodeIcon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon, RedoIcon,
    StrikethroughIcon,
    UnderlineIcon, UndoIcon
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";

interface MenuBarProps {
    editor: Editor | null
}



const MenuBar = ({editor}: MenuBarProps) => {
    const editorState = useEditorState({
        editor,
        selector: ({editor}) => {
            if (!editor) return null;

            return {
                isBold: editor.isActive("bold"),
                isItalic: editor.isActive("italic"),
                isStrike: editor.isActive("strike"),
                isUnderline: editor.isActive("underline"),
                isCodeBlock: editor.isActive("codeBlock"),
                isOrdered: editor.isActive("orderedList"),
                isBullet: editor.isActive("bulletList"),
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo(),
            }
        }
    })

    if (!editor) return null;

    return (
        <div className={"border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center"}>
            <TooltipProvider>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("bold")}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn(
                                    editorState?.isBold && "bg-muted text-muted-foreground"
                                )}
                            >
                                <BoldIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bold
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("italic")}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(
                                    editorState?.isItalic && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ItalicIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Italic
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("underline")}
                                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                                className={cn(
                                    editorState?.isUnderline && "bg-muted text-muted-foreground"
                                )}
                            >
                                <UnderlineIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Underline
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("strikethrough")}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(
                                    editorState?.isStrike && "bg-muted text-muted-foreground"
                                )}
                            >
                                <StrikethroughIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Strikethrough
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("codeBlock")}
                                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={cn(
                                    editorState?.isCodeBlock && "bg-muted text-muted-foreground"
                                )}
                            >
                                <CodeIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Code Block
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"w-px h-6 bg-border mx-2"}/>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("bulletList")}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(
                                    editorState?.isBullet && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Code Block
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive("orderedList")}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(
                                    editorState?.isOrdered && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListOrderedIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Ordered List
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"w-px h-6 bg-border mx-2"}/>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                type={"button"}
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editorState?.canUndo}
                            >
                                <UndoIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Undo
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                type={"button"}
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editorState?.canRedo}
                            >
                                <RedoIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Redo
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}
export default MenuBar
