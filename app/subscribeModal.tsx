import { SubscribePaywall } from "@/components/sharable/subscribe-paywall";
import { useColorScheme } from "@/lib/useColorScheme";
import { ScrollView } from "react-native";

export default function SubscribeModal() {
	const { backgroundColor } = useColorScheme();

	return (
		<ScrollView contentContainerStyle={{ backgroundColor, height: "100%" }}>
			<SubscribePaywall />
		</ScrollView>
	);
}
