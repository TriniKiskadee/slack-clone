import React from "react";
import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, SendIcon } from "lucide-react";

interface iMessageComposerProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

const MessageComposer = ({ value, onChange, onSubmit, isSubmitting }: iMessageComposerProps) => {
    return (
        <>
            <RichTextEditor
                field={{ value, onChange }}
                sendButton={
                    <Button
                        disabled={isSubmitting || !value}
                        type={"button"}
                        size={"sm"}
                        onClick={onSubmit}
                    >
                        <SendIcon className={"size-4 mr-1"} />
                        Send
                    </Button>
                }
                footerLeft={
                    <Button type={"button"} size={"sm"} variant={"outline"}>
                        <ImageIcon className={"size-4 mr-1"} />
                        Attach
                    </Button>
                }
            />
        </>
    );
};
export default MessageComposer;
