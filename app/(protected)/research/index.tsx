import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import useSWR, { mutate } from "swr";

import { getResearch } from "@/actions/admin";
import {
	fetchInProgressThings,
	fetchTestedThings,
	fetchUntestedThings,
	fetchUpcomingCategories,
	upvoteCategory,
} from "@/actions/labs";
import { getUserUpvoted } from "@/actions/user";
import NewCategoriesRow from "@/components/sharable/new-categories-row";
import { ResearchRowList } from "@/components/sharable/research-row-list";
import SectionHeader from "@/components/sharable/section-header";
import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme } = useColorScheme();
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

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const userVotes = useSWR(`user-votes-${uid}`, () => getUserUpvoted(uid));

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
			tables: ["items", "water_filters", "tap_water_locations"],
			limit: 10,
		});

		setUntestedThings(untested);

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
			type: ["bottled_water", "filter", "tap_water"],
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
			limit: 10,
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

	return (
		<FlatList
			data={[{ key: "content" }]}
			renderItem={() => (
				<View style={{ backgroundColor, paddingBottom: 100 }}>
					<View className="px-8">
						<StickyHeader
							title="Lab testing"
							description="Contribute to and follow product testing "
							icon="plus"
							// @ts-ignore
							path="/contributeModal?kind=new_item"
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
									<ResearchRowList
										data={untestedThings || []}
										limitItems={6}
										status={tabValue}
										label="votes"
										showVotes={tabValue === "untested"}
									/>
								)}
								<View className="mt-6">
									<SectionHeader
										title="New categories"
										subtitle="Vote on new categories for lab testing"
									/>

									<View className="">
										{loading.newCategories ? (
											<View className="flex flex-row overflow-x-scroll">
												{Array.from({ length: 6 }).map((_, index) => (
													<Skeleton
														key={index}
														width={150}
														height={100}
														style={{ borderRadius: 8 }}
													/>
												))}
											</View>
										) : (
											<NewCategoriesRow
												data={newCategories || []}
												handlePress={handleVoteForCategory}
												userVotes={userVotes}
											/>
										)}
									</View>
								</View>
							</TabsContent>
							<TabsContent value="in_progress" className="">
								<ResearchRowList
									data={inProgressThings || []}
									limitItems={6}
									status={tabValue}
									label={null}
									showVotes={tabValue === "in_progress"}
								/>
							</TabsContent>
							<TabsContent value="completed" className="">
								<ResearchRowList
									data={testedThings || []}
									limitItems={10}
									status={tabValue}
									label="dates"
									showVotes={tabValue === "completed"}
								/>
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
