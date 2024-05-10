import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	View,
} from "react-native";

import { H1 } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";

import { sendMessage } from "@/actions/chat";
import ChatMessages from "@/components/sharable/chat-messages";
import { Input } from "@/components/ui/input";

export default function ChatModal() {
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<{ text: string; user: string }[]>(
		[],
	);
	const { subscription, uid, logout } = useUserProvider();
	const router = useRouter();

	const handlSendMessage = async () => {
		if (!uid) {
			Alert.alert("Please login and subscribe to chat", "", [
				{
					text: "OK",
					onPress: () => {
						router.back();
						router.push("/(public)/sign-in");
					},
				},
			]);
			return;
		}

		if (!subscription) {
			router.push("/subscribeModal");
			return;
		}

		setIsLoading(true);

		setMessages([...messages, { text: query, user: "user" }]);
		setQuery("");

		const res = await sendMessage(query, uid);

		console.log("res: ", res);

		// if (res) {
		// 	setMessages([...messages, { text: query, user: "user" }]);
		// 	setQuery("");
		// }

		setIsLoading(false);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<View className="flex flex-1 flex-col bg-background  pt-8">
				<H1 className="text-center mb-4">Chat with Oasis</H1>
				<View className="flex-1 overflow-y-auto px-6">
					<ChatMessages messages={messages} loading={isLoading} />
				</View>
				<View className="w-full p-4 relative flex items-center mb-2">
					<Input
						placeholder="Ask any question about water"
						value={query}
						onChangeText={setQuery}
						aria-labelledbyledBy="inputLabel"
						aria-errormessage="inputError"
						className="!rounded-full w-full pl-4 pr-12"
					/>
					<TouchableOpacity
						onPress={handlSendMessage}
						className="absolute right-9 inset-y-0 my-aut top-6"
					>
						<Ionicons name="send" size={24} color="black" />
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
