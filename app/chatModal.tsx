import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

import { updateUserData } from "@/actions/user";
import ChatList from "@/components/sharable/chat-list";
import Logo from "@/components/sharable/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H3, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import useSessionStorage from "@/lib/hooks/session-storage";
import { useColorScheme } from "@/lib/useColorScheme";

interface Message {
	role: "user" | "assistant";
	content: string;
}

const STARTER_PROMPTS = [
	"Filters that remove PFAS",
	"Why are microplastics in water?",
	"Bottled water with Fluoride",
	"Water filters for lead",
	"What are phthalates?",
	"What are PFAS?",
];

export default function ChatModal() {
	const scrollViewRef = useRef<ScrollView>(null);

	const { subscription, uid } = useUserProvider();
	const router = useRouter();
	const { userData } = useUserProvider();
	const { iconColor, backgroundColor } = useColorScheme();

	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [abortController, setAbortController] = useState<AbortController>();
	const [starterPrompts, setStarterPrompts] = useState<string[]>([]);
	const [assistantId, setAssistantId] = useSessionStorage("assistantId", "");
	const [threadId, setThreadId] = useSessionStorage("threadId", "");
	const [messages, setMessages] = useSessionStorage<Message[]>("messages", []);

	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	useEffect(() => {
		if (userData?.assistant_id) {
			setAssistantId(userData.assistant_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	useEffect(() => {
		if (!messages || messages.length === 0) {
			generateRandomPrompts();
		}
	}, [messages]);

	const generateRandomPrompts = () => {
		const randomPrompts = STARTER_PROMPTS.sort(() => 0.5 - Math.random()).slice(
			0,
			3,
		);
		setStarterPrompts(randomPrompts);
	};

	async function createNewAssistant() {
		if (!uid) {
			throw new Error("No user id found");
		}

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/create-new-assistant`,
				{
					method: "POST",
				},
			);

			const data = await response.json();

			console.log("data: ", data);

			if (response.ok) {
				// add assistant to user
				updateUserData(uid, "assistant_id", data.id);

				setAssistantId(data.id);
				return data.id;
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			console.error("createNewAssistant Error:", error);
			return null;
		}
	}

	async function createNewThread() {
		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/create-new-thread`,
				{
					method: "POST",
					body: JSON.stringify({
						uid,
						assistantId,
					}),
				},
			);

			const data = await response.json();

			if (response.ok) {
				setThreadId(data.id);
				return data.id;
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			console.error("Error:", error);
			return null;
		}
	}

	const handleSendMessage = async (query_?: string) => {
		Keyboard.dismiss(); // Add this line to dismiss the keyboard

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

		const question = query_ || query;

		try {
			setIsLoading(true);

			const newMessage: Message = {
				role: "user",
				content: question,
			};

			// const newAssistantMessage: Message = {
			// 	role: "assistant",
			// 	content: "",
			// };

			// Prepare messages and update state synchronously
			const updatedMessages = [...messages, newMessage];
			setMessages((prevMessages) => [...prevMessages, newMessage]);

			setQuery("");

			let assistant = assistantId;

			// First check for user assistantId
			if (!assistant) {
				assistant = await createNewAssistant();
			}

			if (!assistant) {
				throw new Error("No assistant id found");
			}

			// Initiate threadId
			let thread = threadId;
			if (!thread) {
				thread = await createNewThread();
				console.log("thread: ", thread);
			}

			if (!thread) {
				throw new Error("No thread id found");
			}

			// Create instance of AbortController to handle stream cancellation
			const abortController_ = new AbortController();
			setAbortController(abortController_);
			const { signal } = abortController_;

			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/send-message`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: question,
						assistant_id: assistant,
						thread_id: thread,
						is_stream: false,
					}),
					signal,
				},
			);

			const data = await response.json();
			console.log("data: ", data.content);
			const reply = data.content[0].text.value;
			console.log("reply: ", reply);

			updatedMessages.push({
				role: "assistant",
				content: reply,
			});

			// add assistant message to state
			setMessages(updatedMessages);
		} catch (e: any) {
			console.log("e: ", e);
			Alert.alert("Error sending message", e.message);
		}

		setIsLoading(false);
	};

	const handleReset = async () => {
		setMessages([]);
		setThreadId("");
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<View className="flex flex-1 flex-col pt-5 py-4">
				<View className="flex flex-row items-center justify-center relative">
					<View />
					<H3 className="text-center mb-4">Chat with Oasis</H3>
					<Button
						variant="ghost"
						onPress={handleReset}
						label="reset"
						className="absolute right-2 -top-2"
					/>
				</View>
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={{
						flexGrow: 1,
						flexDirection: "column",
						alignItems: "center",
						padding: 16,
						gap: 16,
						width: "100%",
					}}
				>
					{messages.length > 0 ? (
						<View className="grid gap-4 py-1 text-slate-700 overflow-y-scroll min-h-[44vh]">
							<ChatList
								messages={messages}
								isLoading={isLoading}
								userAvatar={userData?.avatar_url}
							/>
						</View>
					) : (
						<View className="flex h-full items-center justify-center">
							<View className="pb-8">
								<Logo />
							</View>

							{starterPrompts.map((prompt) => (
								<Button
									key={prompt}
									variant="outline"
									label={prompt}
									onPress={() => {
										handleSendMessage(prompt);
									}}
									className="mb-2"
								/>
							))}
						</View>
					)}
				</ScrollView>
				<View className="flex flex-col items-center justify-center px-6 pb-4">
					<View className="w-full relative items-center">
						<Input
							placeholder="Ask Oasis"
							value={query}
							onChangeText={setQuery}
							aria-labelledbyledBy="inputLabel"
							aria-errormessage="inputError"
							className="!rounded-full w-full pl-4 pr-12 bg-input"
						/>
						<TouchableOpacity
							onPress={() => handleSendMessage(query)}
							className="absolute right-4 top-1/2 transform -translate-y-1/2"
						>
							<Ionicons name="send" size={24} color={iconColor} />
						</TouchableOpacity>
					</View>
					<Muted>Oasis AI may provide inaccurate and incomplete answers.</Muted>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
