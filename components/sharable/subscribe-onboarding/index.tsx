import Octicons from "@expo/vector-icons/Octicons";
import { ScrollView, View } from "react-native";

import { FEATURES } from "@/app/subscribeModal";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export function SubscribeOnboarding({
	setSelectedPlan,
	selectedPlan,
}: {
	setSelectedPlan: (plan: string) => void;
	selectedPlan: string;
}) {
	const { accentColor, iconColor } = useColorScheme();
	const { tapScore } = useUserProvider();

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<View className="w-full items-center flex flex-col ">
				{/* Features */}
				<View className="flex flex-col h-full min-h-48 gap-8 pt-8 mt-4">
					{FEATURES.map((feature, index) => (
						<View
							key={index}
							className="flex flex-row gap-5 w-full items-center"
						>
							<Octicons
								name="check-circle-fill"
								size={24}
								color={accentColor}
							/>
							<P className="text-center text-xl">{feature.label}</P>
						</View>
					))}
				</View>
			</View>

			{/* <View className="flex flex-row gap-4 w-full p-4 mb-4">
				<TouchableOpacity
					className={`flex-1 flex flex-col justify-between border border-border rounded-lg py-2 px-4 ${selectedPlan === "annual" ? "border-primary border-2" : ""}`}
					onPress={() => setSelectedPlan("annual")}
				>
					<P className="text-left text-lg font-semibold">Yearly access</P>

					<View className="flex flex-row justify-between items-end mt-4">
						<P className="text-xl font-semibold">$47</P>
						<Muted className="">$0.90 /wk</Muted>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className={`flex-1 flex flex-col justify-between border border-border rounded-lg py-2 px-4 ${selectedPlan === "weekly" ? "border-primary border-2" : ""}`}
					onPress={() => setSelectedPlan("weekly")}
				>
					<P className="text-lg font-semibold">Weekly access</P>
					<View className="flex flex-row justify-between mt-4">
						<P className="text-xl font-semibold">$4.99</P>
					</View>
				</TouchableOpacity>
			</View> */}

			{/* <View className="flex flex-row gap-x-4 px-8 mt-2 justify-center">
				<Button
					label="Terms of Use"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/terms");
					}}
				/>

				<Button
					label="Privacy Policy"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/privacy-policy");
					}}
				/>

				<Button
					label="Refund Policy"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/refund-policy");
					}}
				/>
			</View> */}
		</ScrollView>
	);
}
