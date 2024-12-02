import { BlurView } from "expo-blur";
import { View } from "react-native";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	data: any;
	hasActiveSub: boolean;
	isItemUnlocked: boolean;
};

export default function ContaminantCard({
	data,
	hasActiveSub,
	isItemUnlocked,
}: Props) {
	const { redColor, iconColor } = useColorScheme();

	// {
	// 	/* <View className="flex flex-col gap-2">
	// 					{data.health_guideline && (
	// 						<Typography
	// 							size="xs"
	// 							fontWeight="normal"
	// 							className="text-muted-foreground mt-2"
	// 						>
	// 							Health Guideline: {data?.health_guideline} {data?.measure}
	// 						</Typography>
	// 					)}
	// 					{data.legal_limit && (
	// 						<Typography
	// 								size="xs"
	// 								fontWeight="normal"
	// 								className="text-muted-foreground mt-2"
	// 							>
	// 								Legal Limit: {data?.legal_limit} {data?.measure}
	// 							</Typography>
	// 		)}
	// 	</View> */
	// }

	const totalRisks = data.risks.split(",").length;

	const exceedsLimit = data?.exceedingLimit > 0;

	return (
		<Card className="rounded-2xl relative">
			<CardHeader>
				<View className="flex flex-row justify-between items-start">
					<CardTitle className="flex flex-col justify-between relative text-primary text-xl w-40 text-wrap font-semibold">
						{data?.name}
					</CardTitle>

					<View className=" flex flex-row justify-between items-top">
						{exceedsLimit && (
							<View
								className="rounded-full bg-primary\ gap-2 h-8 flex flex-row justify-center items-center px-4"
								style={{
									backgroundColor: redColor,
								}}
							>
								<P className="!text-background">{data.exceedingLimit}x</P>
								<P className="text-secondary flex-wrap">guidelines</P>
							</View>
						)}

						{!exceedsLimit && totalRisks > 0 && (
							<View
								className="rounded-full  gap-2 h-8 flex flex-row justify-center items-center px-4"
								style={{
									borderColor: redColor,
								}}
							>
								<P
									className="text-secondary flex-wrap"
									style={{
										color: redColor,
									}}
								>
									{totalRisks} risks
								</P>
							</View>
						)}
					</View>
				</View>

				<CardDescription className="overflow-hidden mt-2 flex flex-col gap-2">
					{data?.risks}
				</CardDescription>
			</CardHeader>

			{!hasActiveSub && !isItemUnlocked && (
				<BlurView
					intensity={32}
					tint="regular"
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 20,
						borderRadius: 12,
						height: "100%",
						overflow: "hidden",
						backgroundColor: "rgba(255, 255, 255, 0.2)",
					}}
				/>
			)}

			{/* <CardFooter className="flex flex-row w-full justify-end px-4 pb-4 gap-x-8">
				{data.amount && (
					<P>
						{data?.amount} {data?.unit} {data?.measure}
					</P>
				)}
				<View

				// style={{
				// 	backgroundColor: redColor,
				// }}
				>
					<Feather name="arrow-right" size={18} color={iconColor} />
				</View>
			</CardFooter> */}
		</Card>
	);
}
