import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { fetchTestedPreview } from "@/actions/admin";
import { ResearchRowList } from "@/components/sharable/research-row-list";
import SectionHeader from "@/components/sharable/section-header";
import Skeleton from "@/components/sharable/skeleton";
import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme } = useColorScheme();
	// const { blogs } = useContext(BlogContext);

	const params = useLocalSearchParams<{ defaultTab?: string }>();
	const { defaultTab } = params;

	const [tabValue, setTabValue] = useState(defaultTab || "untested");
	const [loading, setLoading] = useState({
		untested: true,
		inProgress: true,
		tested: true,
		newCategories: true,
	});

	const [testedThings, setTestedThings] = useState<any[]>([]);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	useEffect(() => {
		getTestedItems();
	}, []);

	const getTestedItems = async () => {
		setLoading((prevState) => ({
			...prevState,
			tested: true,
		}));

		const data = await fetchTestedPreview({
			limit: 20,
		});

		setTestedThings(data);

		setLoading((prevState) => ({
			...prevState,
			tested: false,
		}));
	};

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{
				paddingBottom: 100,
				paddingHorizontal: 28,
				paddingTop: 10,
			}}
		>
			<P className="text-muted-foreground text-sm">
				💧 Water and product quality can change as frequently as every week.
				Follow the latest lab results that may affect your health.
			</P>
			<View className="flex flex-col mt-4">
				<SectionHeader title="Latest results" />

				<View>
					{loading.tested ? (
						<View className="flex flex-col gap-y-4">
							{Array.from({ length: 8 }).map((_, index) => (
								<Skeleton key={index} width="100%" height={40} />
							))}
						</View>
					) : testedThings && testedThings.length > 0 ? (
						<ResearchRowList
							data={testedThings || []}
							limitItems={50}
							status={tabValue}
							label="dates"
							showVotes={false}
						/>
					) : null}
				</View>
			</View>

			{/* <View className="flex flex-col mb-10">
				<SectionHeader title="New findings" />
				{blogs.length === 0 ? (
					<FlatList
						data={[1, 2, 3]}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							paddingHorizontal: 0,
						}} 
						className="overflow-x-scroll"
						renderItem={() => (
							<Skeleton
								width={180}
								height={120}
								style={{
									borderRadius: 8,
									marginRight: 16,
								}}
							/>
						)}
						keyExtractor={(item) => item.toString()}
					/>
				) : (
					<FlatList
						data={blogs}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							paddingHorizontal: 0,
						}}
						className="overflow-x-scroll"
						renderItem={({ item }: { item: any }) => (
							<Link
								href={`/search/article/${item.id}`}
								className="flex flex-col mr-1"
							>
								<View style={{ width: 140 }}>
									<View
										style={{
											width: 140,
											height: 80,
											borderRadius: 8,
											overflow: "hidden",
											position: "relative",
										}}
									>
										<Image
											source={{ uri: item.cover }}
											alt={item.attributes.title}
											style={{
												width: "100%",
												height: "100%",
												borderRadius: 8,
											}}
										/>
										<View
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												right: 0,
												bottom: 0,
												backgroundColor: "rgba(0,0,0,0.3)",
												padding: 8,
												justifyContent: "flex-end",
											}}
										>
											<P
												className="text-left text-white font-bold text-sm"
												numberOfLines={3}
												ellipsizeMode="tail"
											>
												{item.attributes.title}
											</P>
										</View>
									</View>
								</View>
							</Link>
						)}
						keyExtractor={(item: any) => item.id}
					/>
				)}
			</View> */}
		</ScrollView>
	);
}
