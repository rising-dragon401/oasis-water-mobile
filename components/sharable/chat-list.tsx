import { View } from "react-native";

import { ChatMessage } from "./chat-message";
import Loader from "./loader";

import { Muted } from "@/components/ui/typography";

export interface ChatListProps {
	messages: any[];
	isLoading: boolean;
	userAvatar?: string;
}

export default function ChatList({
	messages,
	isLoading,
	userAvatar,
}: ChatListProps) {
	return (
		<View className="relative mx-auto max-w-2xl md:px-4">
			{messages.map((message, index) => (
				<View key={index} className="my-4 md:my-8">
					<ChatMessage
						message={message}
						index={index}
						messagesLength={messages.length}
						isLoading={isLoading}
						userAvatar={userAvatar}
					/>
				</View>
			))}

			{isLoading && (
				<View className="ml-2 mt-4 flex flex-col items-center gap-4 justify-center text-center">
					<Muted>Analayzing data & research (10-20 sec)</Muted>
					<Loader defaultColor="dark" size="small" />
				</View>
			)}
		</View>
	);
}
