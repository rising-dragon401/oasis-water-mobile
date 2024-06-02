import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Markdown from "react-native-markdown-display";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";

const OasisAvatar =
	"https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/logo/icon.png";

export interface ChatMessageProps {
	message: any;
	isLoading: boolean;
	messagesLength: number;
	index?: number;
	userAvatar?: string;
}

export function ChatMessage({
	message,
	isLoading,
	index,
	messagesLength,
	userAvatar,
	...props
}: ChatMessageProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
	const { colorScheme } = useColorScheme();

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	const textColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	return (
		<Animated.View
			style={{ opacity: fadeAnim }}
			className={cn(
				"group relative mb-4 flex flex-row items-start max-w-xl min-w-[90vw] px-4",
				{
					"flex-row-reverse": message.role === "user",
				},
			)}
			{...props}
		>
			{message.role === "assistant" && (
				<Avatar alt="chat avatar">
					<AvatarImage src={OasisAvatar} className="flex " />
					<AvatarFallback>O</AvatarFallback>
				</Avatar>
			)}
			<View
				className={`
					!max-w-[80vw] space-y-2 overflow-hidden rounded-xl px-4
					${message.role === "user" ? "bg-border py-1" : "flex justify-start w-full"}
      			`}
			>
				<Markdown
					style={{
						text: {
							color: textColor,
						},
					}}
				>
					{message.content}
				</Markdown>
			</View>
		</Animated.View>
	);
}
