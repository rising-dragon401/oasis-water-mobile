import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { View } from "react-native";
import Typography from "../typography";
import { ArticlesDropdown } from "./articles-dropdown";
import { ContaminantFiltersDropdown } from "./contaminant-filters-dropdown";

type Props = {
	data: any;
};

export default function ContaminantCard({ data }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-col w-full justify-between relative">
					<View className="w-full flex flex-row justify-between items-top">
						<View className="max-w-48 break-words flex-wrap">{data?.name}</View>
						{data.exceedingLimit !== undefined &&
							data.exceedingLimit !== null &&
							data.exceedingLimit > 0 && (
								<div className="rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center">
									<Typography
										size="xl"
										fontWeight="normal"
										className="!text-background"
									>
										{data.exceedingLimit}x
									</Typography>
									<Typography
										size="xs"
										fontWeight="normal"
										className="!text-secondary-foreground flex-wrap"
									>
										Guidelines
									</Typography>
								</div>
							)}
					</View>
				</CardTitle>
				<CardDescription className="h-10 overflow-hidden">
					{data?.description}
				</CardDescription>
				<CardContent className="pl-0">
					<div className="h-24 overflow-hidden">
						<Typography
							size="base"
							fontWeight="normal"
							className="text-secondary "
						>
							Risks: {data?.risks}
						</Typography>
					</div>
					{data.amount && (
						<Typography
							size="base"
							fontWeight="bold"
							className="text-secondary mt-2"
						>
							Amount: {data?.amount} {data?.unit} {data?.measure}
						</Typography>
					)}
					{data.health_guideline && (
						<Typography
							size="xs"
							fontWeight="normal"
							className="text-secondary mt-2"
						>
							Health Guideline: {data?.health_guideline} {data?.measure}
						</Typography>
					)}
					{data.legal_limit && (
						<Typography
							size="xs"
							fontWeight="normal"
							className="text-secondary mt-2"
						>
							Legal Limit: {data?.legal_limit} {data?.measure}
						</Typography>
					)}
				</CardContent>
				<CardFooter className="flex flex-row  w-full justify-between p-0">
					<ContaminantFiltersDropdown
						contaminantId={data?.id || ""}
						align="start"
					/>

					{data?.sources ? (
						<ArticlesDropdown sources={data?.sources || []} />
					) : (
						<div></div>
					)}
				</CardFooter>
			</CardHeader>
		</Card>
	);
}
