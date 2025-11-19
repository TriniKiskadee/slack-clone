import * as React from "react";
import EmojiReaction from "./emoji-reaction";

const ReactionsBar = () => {
	return (
		<div className={"mt-1 flex items-center gap-1"}>
			<EmojiReaction />
		</div>
	);
};

export default ReactionsBar;
