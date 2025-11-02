import React from "react";
import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, SendIcon } from "lucide-react";
import ImageUploadModal from "@/components/rich-text-editor/image-upload-modal";
import {UseAttachmentUploadType} from "@/hooks/use-attachment-upload";
import AttachmentChip
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/attachment-chip";

interface iMessageComposerProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    upload: UseAttachmentUploadType
}

const MessageComposer = ({ value, onChange, onSubmit, isSubmitting, upload }: iMessageComposerProps) => {
    return (
        <>
            <RichTextEditor
                field={{ value, onChange }}
                sendButton={
                    <Button
                        disabled={isSubmitting}
                        type={"button"}
                        size={"sm"}
                        onClick={onSubmit}
                    >
                        <SendIcon className={"size-4 mr-1"} />
                        Send
                    </Button>
                }
                footerLeft={
                    upload.stagedUrl ? (
                        <AttachmentChip
                            url={upload.stagedUrl}
                            onRemove={upload.clear}
                        />
                    ) : (
                        <Button
                            onClick={() => upload.setIsOpen(true)}
                            type={"button"}
                            size={"sm"}
                            variant={"outline"}
                        >
                            <ImageIcon className={"size-4 mr-1"} />
                            Attach
                        </Button>
                    )
                }
            />

            <ImageUploadModal
                open={upload.isOpen}
                onOpenChange={upload.setIsOpen}
                onUploaded={(url) => upload.onUploaded(url)}
            />
        </>
    );
};
export default MessageComposer;
