import { View } from "react-native";

import Typography from "../typography";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	data: any;
};

export default function ContaminantCard({ data }: Props) {
	const { redColor } = useColorScheme();

	return (
		<Card>
			<CardHeader>
				<View className="flex flex-row justify-between items-center">
					<CardTitle className="flex flex-col justify-between relative text-primary">
						{data?.name}
					</CardTitle>
					<View className=" flex flex-row justify-between items-top">
						{data.exceedingLimit !== undefined &&
							data.exceedingLimit !== null &&
							data.exceedingLimit > 0 && (
								<View
									className="rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center px-2"
									style={{
										backgroundColor: redColor,
									}}
								>
									<P className="!text-background">{data.exceedingLimit}x</P>
									<P className="text-secondary flex-wrap">guidelines</P>
								</View>
							)}
					</View>
				</View>

				<CardDescription className="overflow-hidden mt-2">
					{data?.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-0 max-w-96 px-6 ">
				<View className="max-h-32 overflow-hidden">
					<Typography
						size="base"
						fontWeight="normal"
						className="text-muted-foreground mt-2"
					>
						Risks: {data?.risks}
					</Typography>
				</View>
				{data.amount && (
					<Typography
						size="base"
						fontWeight="bold"
						className="text-muted-foreground mt-2 "
					>
						Amount: {data?.amount} {data?.unit} {data?.measure}
					</Typography>
				)}
				{data.health_guideline && (
					<Typography
						size="xs"
						fontWeight="normal"
						className="text-muted-foreground mt-2"
					>
						Health Guideline: {data?.health_guideline} {data?.measure}
					</Typography>
				)}
				{data.legal_limit && (
					<Typography
						size="xs"
						fontWeight="normal"
						className="text-muted-foreground mt-2"
					>
						Legal Limit: {data?.legal_limit} {data?.measure}
					</Typography>
				)}
			</CardContent>
			{/* <CardFooter className="flex flex-row w-full justify-end px-4 pb-4">
				{data?.sources && data?.sources.length > 0 ? (
					<ArticlesDropdown sources={data?.sources || []} />
				) : (
					<View />
				)} */}
			{/* <ContaminantFiltersDropdown
					contaminantId={data?.id || ""}
					align="end"
				/> */}
			{/* </CardFooter> */}
		</Card>
	);
}
