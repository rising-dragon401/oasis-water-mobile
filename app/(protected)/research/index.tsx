import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

import { fetchTestedPreview } from "@/actions/admin";
import { ResearchRowList } from "@/components/sharable/research-row-list";
import SectionHeader from "@/components/sharable/section-header";
import Skeleton from "@/components/sharable/skeleton";
import { P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme } = useColorScheme();
	const { blogs } = useContext(BlogContext);
	const router = useRouter();
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

	const [refreshing, setRefreshing] = useState(false);

	const [page, setPage] = useState(1);

	useEffect(() => {
		getTestedItems();
	}, []);

	const getTestedItems = async (pageNumber = 1) => {
		setLoading((prevState) => ({
			...prevState,
			tested: true,
		}));

		const data = await fetchTestedPreview({
			limit: 10,
			page: pageNumber,
		});

		setTestedThings((prevData) => [...prevData, ...data]);

		setLoading((prevState) => ({
			...prevState,
			tested: false,
		}));
	};

	const loadMoreItems = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		getTestedItems(nextPage);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await getTestedItems();
		setRefreshing(false);
	};

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{
				paddingBottom: 100,
				paddingHorizontal: 28,
				paddingTop: 10,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<P className="text-muted-foreground text-sm border-b border-border my-2">
				👋💧 Water and product quality can change frequently – always check the
				latest scores.
			</P>

			<View className="flex flex-col bg-card mt-4">
				<SectionHeader title="Latest research" />
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
							paddingHorizontal: 0,
						}}
						className="overflow-x-scroll"
						renderItem={({ item }: { item: any }) => (
							<TouchableOpacity
								onPress={() => {
									router.push(`/research/article/${item.id}`);
								}}
								className="flex flex-col mr-4"
							>
								<View style={{ width: 150 }}>
									<View
										style={{
											width: 150,
											height: 100,
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
												className="text-left text-white text-sm"
												numberOfLines={3}
												ellipsizeMode="tail"
											>
												{item.attributes.title}
											</P>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={(item: any) => item.id}
					/>
				)}
			</View>

			<View className="flex flex-col mt-8 overflow-visible">
				<SectionHeader title="Newest ratings" />

				<View className="overflow-visible">
					{loading.tested ? (
						<View className="flex flex-col gap-y-4">
							{Array.from({ length: 5 }).map((_, index) => (
								<Skeleton key={index} width="100%" height={60} />
							))}
						</View>
					) : testedThings && testedThings.length > 0 ? (
						<View className="flex flex-col gap-y-4 overflow-visible">
							<ResearchRowList
								data={testedThings || []}
								limitItems={20}
								status={tabValue}
								label="dates"
							/>
							{/* <Button onPress={loadMoreItems} title="Load More" /> */}
						</View>
					) : null}
				</View>
			</View>
		</ScrollView>
	);
}
