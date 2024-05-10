import { ActivityIndicator, View } from "react-native";

import { P } from "@/components/ui/typography";

type ChatMessagesProps = {
	messages: any[];
	loading: boolean;
};

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
	return (
		<View>
			{messages &&
				messages.map((message, index) => (
					<View key={index}>
						<View>
							<P>{message.sender}</P>
							<P>{message.date}</P>
						</View>
						<View>
							<P>{message.text}</P>
						</View>
					</View>
				))}

			{loading && <ActivityIndicator />}
		</View>
	);
}
