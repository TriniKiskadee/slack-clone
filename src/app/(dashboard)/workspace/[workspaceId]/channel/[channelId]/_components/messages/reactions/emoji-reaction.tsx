import { Button } from "@/components/ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SmilePlusIcon } from "lucide-react";
import React, { useState } from "react";

const EmojiReaction = () => {
	const [open, setOpen] = useState<boolean>(false);

	const handleEmojiSelect = (emoji: string) => {
		console.log(emoji);
		setOpen(false);
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant={"ghost"} size={"icon"} className={"size-6"}>
					<SmilePlusIcon className={"size-4 text-muted-foreground"} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={"w-fit p-0"} align={"start"}>
				<EmojiPicker
					className={"h-[342px]"}
					onEmojiSelect={(e) => handleEmojiSelect(e.emoji)}
				>
					<EmojiPickerSearch />
					<EmojiPickerContent />
					<EmojiPickerFooter />
				</EmojiPicker>
			</PopoverContent>
		</Popover>
	);
};

export default EmojiReaction;

// WIP: 8:05:00
