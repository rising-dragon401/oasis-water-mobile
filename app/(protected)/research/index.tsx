import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { mutate } from "swr";

import { getResearch } from "@/actions/admin";
import {
	fetchInProgressThings,
	fetchTestedThings,
	fetchUntestedThings,
	fetchUpcomingCategories,
	upvoteCategory,
} from "@/actions/labs";
import { ResearchRowList } from "@/components/sharable/research-row-list";
import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme, iconColor } = useColorScheme();
	const { uid } = useUserProvider();
	const params = useLocalSearchParams<{ defaultTab?: string }>();
	const { defaultTab } = params;

	const [tabValue, setTabValue] = useState(defaultTab || "untested");
	const [research, setResearch] = useState<any[]>([]);
	const [loading, setLoading] = useState({
		untested: true,
		inProgress: true,
		tested: true,
		newCategories: true,
	});
	const [untestedThings, setUntestedThings] = useState<any[]>([]);
	const [inProgressThings, setInProgressThings] = useState<any[]>([]);
	const [testedThings, setTestedThings] = useState<any[]>([]);
	const [newCategories, setNewCategories] = useState<any[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [untestedPage, setUntestedPage] = useState(1);
	const [inProgressPage, setInProgressPage] = useState(1);
	const [testedPage, setTestedPage] = useState(1);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const limitItems = 10;

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

		getUpcomingCategories();
	}, []);

	useEffect(() => {
		setTabValue(defaultTab || "untested");
	}, [defaultTab]);

	const getUntestedItems = async () => {
		const untested = await fetchUntestedThings({
			tables: ["items"],
			limit: 15,
		});

		setUntestedThings(untested || []);

		setLoading((prevState) => ({
			...prevState,
			untested: false,
		}));
	};

	const getInProgressItems = async () => {
		setLoading((prevState) => ({
			...prevState,
			inProgress: true,
		}));

		const data = await fetchInProgressThings({
			type: ["bottled_water"],
			limit: 10,
		});

		setInProgressThings(data);

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

		const data = await fetchTestedThings({
			tables: ["items", "water_filters", "tap_water_locations"],
			limit: 15,
		});

		setTestedThings(data);

		setLoading((prevState) => ({
			...prevState,
			tested: false,
		}));
	};

	const getUpcomingCategories = async () => {
		setLoading((prevState) => ({
			...prevState,
			newCategories: true,
		}));

		const data = await fetchUpcomingCategories();

		setNewCategories(data || []);

		setLoading((prevState) => ({
			...prevState,
			newCategories: false,
		}));
	};

	const handleVoteForCategory = async (id: string) => {
		await upvoteCategory(id, uid || "");
		await getUpcomingCategories();
		mutate(`user-votes-${uid}`);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		setLoading({
			untested: true,
			inProgress: true,
			tested: true,
			newCategories: true,
		});
		await getUntestedItems();
		await getInProgressItems();
		await getTestedItems();
		await getUpcomingCategories();
		setLoading({
			untested: false,
			inProgress: false,
			tested: false,
			newCategories: false,
		});
		setRefreshing(false);
	};

	const fetchMoreUntestedItems = async () => {
		const newPage = untestedPage + 1;
		const moreUntested = await fetchUntestedThings({
			tables: ["items"],
			limit: limitItems,
			offset: newPage * limitItems,
		});

		if (moreUntested && moreUntested.length > 0) {
			setUntestedThings((prev) => [...prev, ...moreUntested]);
			setUntestedPage(newPage);
		}
	};

	const fetchMoreInProgressItems = async () => {
		const newPage = inProgressPage + 1;
		const moreInProgress = await fetchInProgressThings({
			type: ["bottled_water"],
			limit: limitItems,
			offset: newPage * limitItems,
		});

		if (moreInProgress && moreInProgress.length > 0) {
			setInProgressThings((prev) => [...prev, ...moreInProgress]);
			setInProgressPage(newPage);
		}
	};

	const fetchMoreTestedItems = async () => {
		const newPage = testedPage + 1;
		const moreTested = await fetchTestedThings({
			tables: ["items", "water_filters", "tap_water_locations"],
			limit: limitItems,
			offset: newPage * limitItems,
		});

		if (moreTested && moreTested.length > 0) {
			setTestedThings((prev) => [...prev, ...moreTested]);
			setTestedPage(newPage);
		}
	};

	return (
		<FlatList
			data={[{ key: "content" }]}
			renderItem={() => (
				<View style={{ backgroundColor, paddingBottom: 100 }}>
					<View className="px-8">
						<StickyHeader
							title="Product testing"
							description="Track our latest lab results"
							icon="plus"
							path="/contributeModal?kind=new_item"
							showContributions
						/>

						<Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
							<TabsList className="mb-2">
								<TabsTrigger value="untested">
									<P
										className={`${
											tabValue === "untested"
												? "!font-semibold text-background"
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
												? "!font-semibold text-background"
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
												? "!font-semibold text-background"
												: "text-primary"
										}`}
									>
										Tested
									</P>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="untested" className="">
								{loading.untested ? (
									<View className="flex flex-col gap-2">
										{Array.from({ length: 6 }).map((_, index) => (
											<Skeleton
												key={index}
												width="100%"
												height={50}
												style={{ borderRadius: 8 }}
											/>
										))}
									</View>
								) : (
									<>
										<ResearchRowList
											data={untestedThings || []}
											limitItems={untestedPage * 15}
											status={tabValue}
											size="large"
											label="funding"
											showVotes={tabValue === "untested"}
										/>
									</>
								)}
								<View className="flex justify-center items-center mt-1 w-full">
									<TouchableOpacity
										onPress={fetchMoreUntestedItems}
										disabled={loading.untested}
										className="flex w-32 mt-2 bg-white rounded-full px-4 py-2 shadow-md"
										style={{
											shadowColor: "#000",
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 0.3,
											shadowRadius: 3.84,
											elevation: 5,
										}}
									>
										<P className="text-sm text-center">View more</P>
									</TouchableOpacity>
								</View>
							</TabsContent>
							<TabsContent value="in_progress" className="">
								<ResearchRowList
									data={inProgressThings || []}
									limitItems={inProgressPage * 10}
									status={tabValue}
									label={null}
									showVotes={tabValue === "in_progress"}
								/>
								{inProgressThings.length === inProgressPage * limitItems && (
									<View className="flex justify-center items-center mt-1 w-full">
										<TouchableOpacity
											disabled={loading.inProgress}
											onPress={fetchMoreInProgressItems}
											className="flex w-32 mt-2 bg-white rounded-full px-4 py-2 shadow-md"
											style={{
												shadowColor: "#000",
												shadowOffset: { width: 0, height: 2 },
												shadowOpacity: 0.3,
												shadowRadius: 3.84,
												elevation: 5,
											}}
										>
											<P className="text-sm text-center">View more</P>
										</TouchableOpacity>
									</View>
								)}
							</TabsContent>
							<TabsContent value="completed" className="">
								<ResearchRowList
									data={testedThings || []}
									limitItems={testedPage * 15}
									status={tabValue}
									label="dates"
									showVotes={tabValue === "completed"}
								/>
								<View className="flex justify-center items-center mt-1 w-full">
									<TouchableOpacity
										onPress={fetchMoreTestedItems}
										disabled={loading.tested}
										className="flex w-32 mt-2 bg-white rounded-full px-4 py-2 shadow-md"
										style={{
											shadowColor: "#000",
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 0.3,
											shadowRadius: 3.84,
											elevation: 5,
										}}
									>
										<P className="text-sm text-center">View more</P>
									</TouchableOpacity>
								</View>
							</TabsContent>
						</Tabs>
					</View>
				</View>
			)}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		/>
	);
}
