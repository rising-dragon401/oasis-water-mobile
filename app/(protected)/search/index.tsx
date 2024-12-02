import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

import { fetchTestedPreview } from "@/actions/admin";
import { getStores } from "@/actions/stores";
import { BrandsList } from "@/components/sharable/brands-list";
import CategoryList from "@/components/sharable/category-list";
import { LocationsList } from "@/components/sharable/locations-list";
import { PeopleList } from "@/components/sharable/people-list";
import { RecentsList } from "@/components/sharable/recents-list";
import Search from "@/components/sharable/search";
import SectionHeader from "@/components/sharable/section-header";
import Skeleton from "@/components/sharable/skeleton";
import { P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TabOneScreen() {
	const router = useRouter();
	const { shadowColor } = useColorScheme();
	const showToast = useToast();
	const { hasActiveSub, checkForSubscription } = useSubscription();
	const [stores, setStores] = useState<any[]>([]);
	const [recents, setRecents] = useState<any[]>([]);
	const [searchInputActive, setSearchInputActive] = useState(false);
	const [permission, requestPermission] = Camera.useCameraPermissions();

	useEffect(() => {
		const fetch = async () => {
			await checkForSubscription();

			const data = await getStores();
			setStores(data || []);

			const recentData = await fetchTestedPreview({
				limit: 10,
				page: 1,
			});
			setRecents(recentData || []);
		};
		fetch();
	}, []);

	const handleScan = async () => {
		if (!hasActiveSub) {
			router.push("/subscribeModal");
			return;
		}
		if (permission?.granted) {
			router.push("/scanModal");
		} else if (!permission?.granted) {
			const permission_granted = await requestPermission();
			if (permission_granted?.granted) {
				router.push("/scanModal");
			} else {
				showToast("Please allow camera access to use the product scanner");
			}
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 px-6"
		>
			<View className="z-50 pt-8 w-full items-center gap-y-10 bg-background pb-2">
				<Search
					setActive={setSearchInputActive}
					placeholder="Search water brands and filters"
				/>
			</View>

			<ScrollView
				className="flex-1 overflow-visible"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="flex-1 justify-center items-center z-10 w-full gap-y-4">
					<View className="flex flex-col w-full flex-1 mt-4">
						<SectionHeader title="New ratings" />

						{recents.length > 0 ? (
							<RecentsList data={recents} />
						) : (
							<FlatList
								data={[1, 2, 3, 4, 5, 6]} // Placeholder items
								horizontal
								renderItem={() => (
									<View className="mr-4">
										<Skeleton
											width={120}
											height={120}
											style={{ borderRadius: 14 }}
										/>
									</View>
								)}
								keyExtractor={(item) => item.toString()}
							/>
						)}
					</View>

					<View className="flex flex-col w-full mx-4 mt-2">
						<SectionHeader title="What others are drinking" />
						<PeopleList />
					</View>

					<View className="flex flex-col w-full mx-4 mt-2">
						{/* <SectionHeader title="Tap water quality" /> */}
						<LocationsList />
					</View>

					<View className="flex flex-col w-full mx-4 mt-4 overflow-hidden">
						<SectionHeader title="Popular brands" />
						<BrandsList />
					</View>

					<View className="flex flex-col w-full mx-4 mt-4 overflow-visible">
						<SectionHeader title="Top rated" />
						<CategoryList />
					</View>
				</View>
			</ScrollView>

			<TouchableOpacity
				onPress={handleScan}
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					shadowColor,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
					position: "absolute",
					bottom: 30,
					right: 20,
				}}
				className="bg-primary rounded-full px-6 py-4 flex-row items-center justify-center gap-x-6 z-50"
			>
				<P className="text-center text-lg text-white font-medium">🔍 Scan</P>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}
