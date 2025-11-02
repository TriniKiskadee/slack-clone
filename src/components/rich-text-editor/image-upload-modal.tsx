"use client"

import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {UploadDropzone} from "@/lib/uploadthing";
import {toast} from "sonner";
import Link from "next/link";
import Image from "next/image";

interface ImageUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploaded: (url: string) => void
}

const ImageUploadModal = ({onOpenChange, open, onUploaded}: ImageUploadModalProps) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-muted-foreground"}>
                        Upload Image
                    </DialogTitle>
                </DialogHeader>
                <UploadDropzone
                    className={"ut-uploading:opacity-90 ut-ready:bg-card ut-ready:border-border ut-ready:text-foreground ut-uploading:bg-muted ut-uploading:border-border ut-uploading:text-muted-foreground ut-label:text-xm ut-label:text-muted-foreground ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground ut-button:bg-primary rounded-lg border"}
                    appearance={{
                        container: "bg-card",
                        label: "text-muted-foreground",
                        allowedContent: "text-xs text-muted-foreground",
                        button: "bg-primary text-primary-foreground hover:bg-primary/50",
                        uploadIcon: "text-muted-foreground"
                    }}
                    endpoint={"imageUploader"}
                    onClientUploadComplete={(res) => {
                        const url = res[0].ufsUrl
                        toast.success("Image uploaded successfully", {
                            id: "image-upload"
                        })
                        onUploaded(url)
                    }}
                    onUploadError={(error) => {
                        toast.error(error.message, {
                            id: "image-upload"
                        })
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
export default ImageUploadModal
