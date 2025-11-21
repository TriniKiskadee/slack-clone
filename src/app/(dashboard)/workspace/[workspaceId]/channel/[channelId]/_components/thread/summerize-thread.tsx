import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/orpc";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";

interface SummarizeThreadProps {
	messageId: string;
}

const SummarizeThread = ({ messageId }: SummarizeThreadProps) => {
	const [open, setOpen] = useState<boolean>(false);
	const {
		messages,
		status,
		error,
		sendMessage,
		setMessages,
		stop,
		clearError,
	} = useChat({
		id: `thread-summary:${messageId}`,
		transport: {
			async sendMessages(options) {
				return eventIteratorToStream(
					await client.ai.thread.summary.generate(
						{
							messageId: messageId,
						},
						{
							signal: options.abortSignal,
						},
					),
				);
			},
			reconnectToStream() {
				throw new Error("Unsupported");
			},
		},
	});

	const lastAssistant = messages.findLast(
		(message) => message.role === "assistant",
	);
	const summaryText =
		lastAssistant?.parts
			.filter((part) => part.type === "text")
			.map((part) => part.text)
			.join("\n\n") ?? "";

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (nextOpen) {
			const hasAssistantMessage = messages.some(
				(message) => message.role === "assistant",
			);
			if (status !== "ready" || hasAssistantMessage) {
				return;
			}
			sendMessage({
				text: "Summarize thread",
			});
		} else {
			stop();
			clearError();
			setMessages([]);
		}
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					type={"button"}
					size={"sm"}
					className={
						"relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
					}
				>
					<span className={"flex items-center gap-1.5"}>
						<SparklesIcon className={"size-3.5"} />
						<span className={"text-xs font-medium"}>Summarize</span>
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className={"w-[25rem] p-0"} align={"end"}>
				<div
					className={
						"flex items-center justify-between px-4 py-3 border-b"
					}
				>
					<div className={"flex items-center gap-2"}>
						<span
							className={
								"relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-1.5 px-4 gap-1.5"
							}
						>
							<SparklesIcon className={"size-3.5 text-white"} />
							<span className={"text-white text-sm font-medium"}>
								AI Summary (Preview)
							</span>
						</span>
					</div>
					{status === "streaming" && (
						<Button
							onClick={() => {
								stop();
							}}
							type={"button"}
							size={"sm"}
						>
							Stop
						</Button>
					)}
				</div>

				<div className={"px-4 py-3 max-h-80 overflow-y-auto"}>
					{error ? (
						<div>
							<p className={"text-red-500"}>{error.message}</p>
							<Button
								type={"button"}
								size={"sm"}
								onClick={() => {
									clearError();
									setMessages([]);
									sendMessage({ text: "Summarize Thread" });
								}}
							>
								Try Again
							</Button>
						</div>
					) : summaryText ? (
						<Message from={"assistant"}>
							<MessageContent>
								<div
									className={
										"[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
									}
								>
									<MessageResponse
										parseIncompleteMarkdown={
											status !== "ready"
										}
									>
										{summaryText}
									</MessageResponse>
								</div>
							</MessageContent>
						</Message>
					) : status === "submitted" || status === "streaming" ? (
						<div className={"space-y-2"}>
							<Skeleton className={"h-4 w-3/4"} />
							<Skeleton className={"h-4 w-full"} />
							<Skeleton className={"h-4 w-5/6"} />
						</div>
					) : (
						<div className={"text-sm text-muted-foreground"}>
							Click summarize to generate{" "}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default SummarizeThread;

// NOTE: AI SDK Response component no longer available. Using the Message component instead: 11:01:00
