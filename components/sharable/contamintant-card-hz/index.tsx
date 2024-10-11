import { P } from "@/components/ui/typography";
import { Link } from "expo-router";
import { View } from "react-native";
import Typography from "../typography";

type Props = {
	data: any;
};

export default function HorizontalContaminantCard({ data }: Props) {
	return (
		<View className="">
			<Link href={`/(protected)/search/ingredient/${data.id}`}>
				<View className="py-3 px-4 bg-card rounded-lg w-full border-2 border-border">
					<View className="flex flex-row justify-between items-start w-full">
						<View className="flex-1 pr-4 w-full">
							<P className="text-base font-bold">{data?.name}</P>
							<P
								className="text-muted-foreground mt-1 line-clamp-1 overflow-hidden"
								ellipsizeMode="tail"
							>
								{data?.description}
							</P>
						</View>
						{data.exceedingLimit > 1 && (
							<View
								className={`flex-shrink-0 rounded-full w-20 h-8 flex items-center justify-center ml-2 ${
									data.exceedingLimit > 1 && "bg-red-400"
								}`}
							>
								<Typography
									size="base"
									fontWeight="bold"
									className="text-background"
								>
									{data.exceedingLimit}x
								</Typography>
							</View>
						)}
					</View>
				</View>
			</Link>
		</View>
	);
}
