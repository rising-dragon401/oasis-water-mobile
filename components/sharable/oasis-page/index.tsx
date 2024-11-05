import { useUserProvider } from "context/user-provider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import useSWR from "swr";

import ItemPreviewCard from "../item-preview-card";
import ProfileHeader from "./components/profile-header";

import {
	getCurrentUserData,
	getRecommendedProducts,
	getUserFavorites,
} from "@/actions/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { P } from "@/components/ui/typography";

// const ITEM_CATEGORIES = [
// 	{
// 		id: "bottled_water",
// 		title: "Bottled water",
// 	},
// 	{
// 		id: "filter",
// 		title: "Sink / home filter",
// 	},
// 	{
// 		id: "shower_filter",
// 		title: "Shower filter",
// 	},
// 	{
// 		id: "bottle_filter",
// 		title: "Bottle filter",
// 	},
// ];

const WATER_TYPES = ["bottled_water", "water_gallon"];

const FILTER_TYPES = ["filter", "shower_filter", "bottle_filter"];

export default function OasisPage({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const params = useLocalSearchParams<{ tab?: string }>();
	const { uid } = useUserProvider();
	const router = useRouter();

	const { tab: defaultTab } = params;

	const [loading, setLoading] = useState(true);
	const [profileData, setProfileData] = useState<any>(null);
	const [tabValue, setTabValue] = useState(defaultTab || "all");
	const [recommendedProducts, setRecommendedProducts] = useState<any>(null);

	const isAuthUser = userId === uid;

	const fetchUserFavorites = async () => {
		const favorites = await getUserFavorites(userId || "");
		return favorites;
	};

	const { data: favorites } = useSWR(
		`userFavorites-${userId}`,
		fetchUserFavorites,
	);

	// load user favorites
	useEffect(() => {
		if (userId) {
			fetchThisUserData(userId);
		}
	}, [userId]);

	const fetchThisUserData = async (userId: string) => {
		const profileData = await getCurrentUserData(userId);
		setProfileData(profileData);
		setLoading(false);
	};

	useEffect(() => {
		if (userId) {
			fetchThisUserData(userId);
		}
	}, [userId, favorites]);

	useEffect(() => {
		if (isAuthUser && uid) {
			const fetch = async () => {
				const recommendedProducts = await getRecommendedProducts(uid);
				setRecommendedProducts(recommendedProducts);
			};

			fetch();
		} else {
			setTabValue("all");
		}
	}, [isAuthUser]);

	useEffect(() => {
		if (defaultTab) {
			setTabValue(defaultTab);
		}
	}, [defaultTab]);

	return (
		<View>
			<ProfileHeader profileData={profileData} />

			<View className="flex flex-col mt-4">
				<Tabs value={tabValue} onValueChange={setTabValue}>
					<TabsList className="mb-1">
						<TabsTrigger value="all">
							<P
								className={`${tabValue === "all" ? "text-secondary-foreground font-medium" : ""}`}
							>
								All
							</P>
						</TabsTrigger>

						<TabsTrigger value="waters">
							<P
								className={`${tabValue === "waters" ? "text-secondary-foreground font-medium" : ""}`}
							>
								Waters
							</P>
						</TabsTrigger>

						<TabsTrigger value="filters">
							<P
								className={`${tabValue === "filters" ? "text-secondary-foreground font-medium" : ""}`}
							>
								Filters
							</P>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="all">
						<FlatList
							data={favorites}
							renderItem={({ item, index }) => (
								<View
									key={item?.id}
									style={{ width: "48%" }}
									className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
								>
									<ItemPreviewCard
										item={item}
										showFavorite
										isAuthUser={isAuthUser}
									/>
								</View>
							)}
							keyExtractor={(item) => item?.id}
							numColumns={2}
							showsVerticalScrollIndicator={false}
							columnWrapperStyle={{ justifyContent: "space-between" }}
							contentContainerStyle={{
								flexGrow: 0,
								paddingBottom: 0,
								marginBottom: 0,
							}}
							scrollEnabled={false}
						/>
					</TabsContent>
					<TabsContent value="waters">
						<FlatList
							data={favorites?.filter((item) =>
								WATER_TYPES.includes(item.type),
							)}
							renderItem={({ item, index }) => (
								<View
									key={item?.id}
									style={{ width: "48%" }}
									className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
								>
									<ItemPreviewCard
										item={item}
										showFavorite
										isAuthUser={isAuthUser}
									/>
								</View>
							)}
							keyExtractor={(item) => item?.id}
							numColumns={2}
							showsVerticalScrollIndicator={false}
							columnWrapperStyle={{ justifyContent: "space-between" }}
							contentContainerStyle={{
								flexGrow: 0,
								paddingBottom: 0,
								marginBottom: 0,
							}}
							scrollEnabled={false}
						/>
					</TabsContent>
					<TabsContent value="filters">
						<FlatList
							data={favorites?.filter((item) =>
								FILTER_TYPES.includes(item.type),
							)}
							renderItem={({ item, index }) => (
								<View
									key={item?.id}
									style={{ width: "48%" }}
									className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
								>
									<ItemPreviewCard
										item={item}
										showFavorite
										isAuthUser={isAuthUser}
									/>
								</View>
							)}
							keyExtractor={(item) => item?.id}
							numColumns={2}
							showsVerticalScrollIndicator={false}
							columnWrapperStyle={{ justifyContent: "space-between" }}
							contentContainerStyle={{
								flexGrow: 0,
								paddingBottom: 0,
								marginBottom: 0,
							}}
							scrollEnabled={false}
						/>
					</TabsContent>
				</Tabs>
			</View>
		</View>
	);
}
