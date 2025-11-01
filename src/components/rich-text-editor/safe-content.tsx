import React from 'react'
import {JSONContent} from "@tiptap/react";
import {convertJsonToHTML} from "@/lib/json-to-html";
import DOMpurify from "dompurify"
import parse from "html-react-parser";

interface iSafeContentProps {
    content: JSONContent
    className?: string
}

const SafeContent = ({content, className}: iSafeContentProps) => {
    const html = convertJsonToHTML(content)
    const clean = DOMpurify.sanitize(html)
    return (
        <div className={className}>
            {parse(clean)}
        </div>
    )
}
export default SafeContent
