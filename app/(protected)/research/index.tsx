import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

import { getResearch } from "@/actions/admin";
import {
	fetchInProgressItems,
	fetchTestedThings,
	fetchUntestedThings,
} from "@/actions/labs";
import { RowList } from "@/components/sharable/row-list";
import SectionHeader from "@/components/sharable/section-header";
import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme, iconColor } = useColorScheme();
	const router = useRouter();
	const params = useLocalSearchParams<{ defaultTab?: string }>();
	const { defaultTab } = params;

	const [tabValue, setTabValue] = useState(defaultTab || "untested");
	const [research, setResearch] = useState<any[]>([]);
	const [loading, setLoading] = useState({
		untested: false,
		inProgress: false,
		tested: false,
	});
	const [untestedThings, setUntestedThings] = useState<any>({
		waters: [],
		filters: [],
		tapLocations: [],
	});
	const [inProgressThings, setInProgressThings] = useState<any>({
		waters: [],
		filters: [],
		tapLocations: [],
	});
	const [testedThings, setTestedThings] = useState<any>({
		waters: [],
		filters: [],
		tapLocations: [],
	});

	const [refreshing, setRefreshing] = useState(false);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	useEffect(() => {
		setTabValue(defaultTab || "untested");
	}, [defaultTab]);

	useEffect(() => {
		const fetchResearch = async () => {
			const research = await getResearch();

			if (research) {
				setResearch(research);
			}
		};

		fetchResearch();

		getUntestedItems();

		getInProgressItems();

		getTestedItems();
	}, []);

	const getInProgressItems = async () => {
		setLoading((prevState) => ({
			...prevState,
			inProgress: true,
		}));

		const waterData = await fetchInProgressItems({
			type: "bottled_water",
			limit: 10,
		});
		const filterData = await fetchInProgressItems({
			type: "filter",
			limit: 10,
		});
		const tapData = await fetchInProgressItems({
			type: "tap_water",
			limit: 10,
		});

		if (waterData) {
			setInProgressThings((prevState: any) => ({
				...prevState,
				waters: { data: waterData, loading: false },
			}));
		}

		if (filterData) {
			setInProgressThings((prevState: any) => ({
				...prevState,
				filters: { data: filterData, loading: false },
			}));
		}

		if (tapData) {
			setInProgressThings((prevState: any) => ({
				...prevState,
				tapLocations: { data: tapData, loading: false },
			}));
		}

		setLoading((prevState) => ({
			...prevState,
			inProgress: false,
		}));
	};

	const getTestedItems = async () => {
		setLoading((prevState) => ({
			...prevState,
			tested: true,
		}));

		const waterData = await fetchTestedThings({ table: "items", limit: 10 });
		const filterData = await fetchTestedThings({
			table: "water_filters",
			limit: 10,
		});
		const tapData = await fetchTestedThings({
			table: "tap_water_locations",
			limit: 10,
		});

		if (waterData) {
			setTestedThings((prevState: any) => ({
				...prevState,
				waters: waterData,
			}));
		}

		if (filterData) {
			setTestedThings((prevState: any) => ({
				...prevState,
				filters: filterData,
			}));
		}

		if (tapData) {
			setTestedThings((prevState: any) => ({
				...prevState,
				tapLocations: tapData,
			}));
		}

		setLoading((prevState) => ({
			...prevState,
			tested: false,
		}));
	};

	const getUntestedItems = async () => {
		setLoading((prevState) => ({
			...prevState,
			untested: true,
		}));

		const waterData = await fetchUntestedThings({ table: "items", limit: 10 });
		const filterData = await fetchUntestedThings({
			table: "water_filters",
			limit: 10,
		});
		const tapData = await fetchUntestedThings({
			table: "tap_water_locations",
			limit: 10,
		});

		if (waterData) {
			setUntestedThings((prevState: any) => ({
				...prevState,
				waters: waterData,
			}));
		}

		if (filterData) {
			setUntestedThings((prevState: any) => ({
				...prevState,
				filters: filterData,
			}));
		}

		if (tapData) {
			setUntestedThings((prevState: any) => ({
				...prevState,
				tapLocations: tapData,
			}));
		}

		setLoading((prevState) => ({
			...prevState,
			untested: false,
		}));
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await getUntestedItems();
		await getInProgressItems();
		await getTestedItems();
		setRefreshing(false);
	};

	const renderSection = (
		title: string,
		data: any[],
		limitItems: number,
		type: string,
	) => {
		return (
			<View className="flex flex-col gap-2 flex-shrink">
				<SectionHeader
					title={title}
					iconButton={
						<TouchableOpacity
							onPress={() => router.push("/requestModal")}
							className="flex justify-end pt-2"
						>
							<Ionicons name="add" size={20} color={iconColor} />
						</TouchableOpacity>
					}
				/>
				{loading[tabValue as keyof typeof loading] ? (
					<View className="w-full flex-col gap-2">
						<Skeleton width="100%" height={40} style={{ borderRadius: 12 }} />
						<Skeleton width="100%" height={40} style={{ borderRadius: 12 }} />
						<Skeleton width="100%" height={40} style={{ borderRadius: 12 }} />
					</View>
				) : (
					<RowList
						data={data}
						limitItems={limitItems}
						status={tabValue}
						type={type}
						showVotes={tabValue === "untested"}
					/>
				)}
			</View>
		);
	};

	const getDataForTab = (tab: string) => {
		switch (tab) {
			case "untested":
				return [
					{ title: "Waters", data: untestedThings.waters, type: "water" },
					{ title: "Filters", data: untestedThings.filters, type: "filter" },
					{
						title: "Tap Water",
						data: untestedThings.tapLocations,
						type: "tap_water",
					},
				];
			case "in_progress":
				return [
					{
						title: "Waters",
						data: inProgressThings.waters.data,
						type: "water",
					},
					{
						title: "Filters",
						data: inProgressThings.filters.data,
						type: "filter",
					},
					{
						title: "Tap Water",
						data: inProgressThings.tapLocations.data,
						type: "tap_water",
					},
				];
			case "completed":
				return [
					{ title: "Waters", data: testedThings.waters, type: "water" },
					{ title: "Filters", data: testedThings.filters, type: "filter" },
					{
						title: "Tap Water",
						data: testedThings.tapLocations,
						type: "tap_water",
					},
				];
			default:
				return [];
		}
	};

	return (
		<View>
			<FlatList
				data={getDataForTab(tabValue)}
				keyExtractor={(item) => item.title}
				renderItem={({ item }) => (
					<View className="mb-6">
						{renderSection(item.title, item.data, 3, item.type)}
					</View>
				)}
				ListHeaderComponent={
					<>
						<StickyHeader
							title="Lab testing"
							description="Track and vote on what products we test next"
						/>
						<Tabs
							value={tabValue}
							onValueChange={setTabValue}
							className="mt-4 mb-2"
						>
							<TabsList className="mb-1">
								<TabsTrigger value="untested">
									<P
										className={`${
											tabValue === "untested"
												? "text-secondary-foreground"
												: "text-primary"
										}`}
									>
										Untested
									</P>
								</TabsTrigger>
								<TabsTrigger value="in_progress">
									<P
										className={`${
											tabValue === "in_progress"
												? "text-secondary-foreground"
												: "text-primary"
										}`}
									>
										In Progress
									</P>
								</TabsTrigger>
								<TabsTrigger value="completed">
									<P
										className={`${
											tabValue === "completed"
												? "text-secondary-foreground"
												: "text-primary"
										}`}
									>
										Tested
									</P>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</>
				}
				ListFooterComponent={
					<View className="mt-8 mx-auto">
						{/* <Button
						variant="outline"
						// onPress={() => router.push("/requestModal")}
						label="Request something else"
					/> */}
					</View>
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				style={{ backgroundColor }}
				contentContainerStyle={{ paddingHorizontal: 6 }}
				className="px-6"
			/>
		</View>
	);
}
