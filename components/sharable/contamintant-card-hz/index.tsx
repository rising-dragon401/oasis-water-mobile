import { Link } from "expo-router";
import { View } from "react-native";

import { Muted, P } from "@/components/ui/typography";

type Props = {
	data: any;
};

export default function HorizontalContaminantCard({ data }: Props) {
	return (
		<View className="">
			<Link href={`/(protected)/search/ingredient/${data.id}`}>
				<View className="py-3 px-4 bg-card rounded-xl w-full border-2 border-border">
					<View className="flex flex-row justify-between items-start w-full">
						<View className="flex-1 pr-4 w-full">
							<P className="text-base font-bold">{data?.name}</P>
							<Muted className="mt-1 line-clamp-1 overflow-hidden">
								{data?.amount} {data?.measure}
							</Muted>
							<P
								className="text-muted-foreground mt-1 line-clamp-2 overflow-hidden"
								ellipsizeMode="tail"
							>
								{data?.risks ? data?.risks : data?.description}
							</P>
						</View>
						{data.exceedingLimit > 1 && (
							<View
								className={`flex-shrink-0 rounded-full w-20 h-8 flex items-center justify-center ml-2 ${
									data.exceedingLimit > 1 && "bg-red-400"
								}`}
							>
								<P className="text-background">{data.exceedingLimit}x</P>
							</View>
						)}
					</View>
				</View>
			</Link>
		</View>
	);
}
