import {generateHTML, type JSONContent} from "@tiptap/react";
import {baseExtensions} from "@/components/rich-text-editor/extensions";

export function convertJsonToHTML(jsonContent: JSONContent): string {
    try {
        const content = typeof jsonContent === "string"
            ? JSON.parse(jsonContent)
            : jsonContent;

        return generateHTML(content, baseExtensions)
    } catch {
        console.log("Error converting JSON to HTML");
        return ""
    }
}