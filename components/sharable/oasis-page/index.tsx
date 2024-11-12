import { useUserProvider } from "context/user-provider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import ItemPreviewCard from "../item-preview-card";
import UserHeader from "./components/user-header";

import {
	getRecommendedProducts,
	getUserData,
	getUserFavorites,
} from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1, Large, Muted, P } from "@/components/ui/typography";

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
	const [favorites, setFavorites] = useState<any>([]);

	const isAuthUser = userId === uid;

	const fetchUserFavorites = async () => {
		const favorites = await getUserFavorites(userId || "");
		setFavorites(favorites);
	};

	// const { data: favorites } = useSWR(
	// 	`userFavorites-${userId}`,
	// 	fetchUserFavorites,
	// );

	// load user favorites
	useEffect(() => {
		if (userId) {
			fetchThisUserData(userId);
			fetchUserFavorites();
		}
	}, [userId]);

	const fetchThisUserData = async (userId: string) => {
		const profileData = await getUserData(userId);

		// console.log("userId", userId);
		// const score = await calculateUserScore(userId);
		// console.log("score", score);

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

	const filterFavorites = useMemo(() => {
		return favorites?.filter((item: any) => FILTER_TYPES.includes(item.type));
	}, [favorites]);

	const waterFavorites = useMemo(() => {
		return favorites?.filter((item: any) => WATER_TYPES.includes(item.type));
	}, [favorites]);

	const renderNoAccount = ({
		title,
		description,
	}: {
		title?: string;
		description?: string;
	}) => {
		if (!uid) {
			return (
				<View className="flex flex-col justify-center pt-4 gap-y-1">
					<Large>{title}</Large>
					<Muted className="max-w-sm">{description}</Muted>

					<Button
						onPress={() => router.push("/(public)/sign-in")}
						label="Login"
						className="mt-4"
					/>
				</View>
			);
		} else {
			return (
				<View className="flex flex-col justify-center pt-4 gap-y-1">
					<Large>{title}</Large>
					<Muted className="max-w-sm">{description}</Muted>

					<Button
						onPress={() => router.push("/(protected)/search")}
						label="Explore products"
						className="mt-4"
					/>
				</View>
			);
		}
	};

	return (
		<View>
			{isAuthUser && <H1 className="mt-24 mb-6">Products</H1>}

			<UserHeader profileData={profileData} isAuthUser={isAuthUser} />

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

						<TabsTrigger
							value="waters"
							className={`${(waterFavorites && waterFavorites.length > 0) || isAuthUser ? "" : "!hidden"}`}
						>
							<P
								className={`${tabValue === "waters" ? "text-secondary-foreground font-medium" : ""}`}
							>
								Waters
							</P>
						</TabsTrigger>

						<TabsTrigger
							value="filters"
							className={`${
								(filterFavorites && filterFavorites.length > 0) || isAuthUser
									? ""
									: "!hidden"
							}`}
						>
							<P
								className={`${tabValue === "filters" ? "text-secondary-foreground font-medium" : ""}`}
							>
								Filters
							</P>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="all">
						{favorites && favorites.length > 0 ? (
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
						) : (
							renderNoAccount({
								title: "No favorites saved",
								description:
									"Save your favorite waters and filters to see them here.",
							})
						)}
					</TabsContent>

					<TabsContent value="waters">
						{waterFavorites && waterFavorites.length > 0 ? (
							<FlatList
								data={waterFavorites}
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
						) : (
							renderNoAccount({
								title: "No waters saved",
								description: "Save your favorite waters to see them here.",
							})
						)}
					</TabsContent>
					<TabsContent value="filters">
						{filterFavorites && filterFavorites.length > 0 ? (
							<FlatList
								data={filterFavorites}
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
						) : (
							renderNoAccount({
								title: "No filters saved",
								description: "Save your favorite filters to see them here.",
							})
						)}
					</TabsContent>
				</Tabs>
			</View>
		</View>
	);
}
