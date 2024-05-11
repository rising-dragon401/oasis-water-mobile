import { ContaminantFiltersDropdown } from "components/sharable/contaminant-filters-dropdown";
import { View } from "react-native";

import Typography from "../typography";
import { ArticlesDropdown } from "./articles-dropdown";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = {
	data: any;
};

export default function ContaminantCard({ data }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-col justify-between relative text-primary">
					{data?.name}
				</CardTitle>

				<CardDescription className="h-10 overflow-hidden">
					{data?.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-0 max-w-96 px-6">
				<View className="w-full flex flex-row justify-between items-top">
					{data.exceedingLimit !== undefined &&
						data.exceedingLimit !== null &&
						data.exceedingLimit > 0 && (
							<View className="rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center">
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
									className="text-secondary flex-wrap"
								>
									Guidelines
								</Typography>
							</View>
						)}
				</View>
				<View className="h-24 overflow-hidden">
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
						className="text-muted-foreground mt-2"
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
			<CardFooter className="flex flex-row w-full justify-between px-4 pb-4">
				{data?.sources ? (
					<ArticlesDropdown sources={data?.sources || []} />
				) : (
					<View />
				)}
				<ContaminantFiltersDropdown
					contaminantId={data?.id || ""}
					align="start"
				/>
			</CardFooter>
		</Card>
	);
}
