"use client"

import React from 'react'

import {EditorContent, useEditor} from "@tiptap/react"
import {editorExtensions} from "@/components/rich-text-editor/extensions";
import MenuBar from "@/components/rich-text-editor/menu-bar";

const RichTextEditor = () => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: editorExtensions,
        editorProps: {
            attributes: {
                class: "max-w-none min-h-[125px] focus:outline-none p-4 prose dark:prose-invert marker:text-primary"
            }
        }
    })

    return (
        <div className={"relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col"}>
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className={"max-h-[200px] overflow-y-auto"}
            />
        </div>
    )
}
export default RichTextEditor

/* TODO: 8:44:27 */