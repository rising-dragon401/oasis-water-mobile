import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { getStores } from "@/actions/stores";
import CategoryList from "@/components/sharable/category-list";
import SectionHeader from "@/components/sharable/section-header";
import StoreList from "@/components/sharable/store-list";
import { useDataProvider } from "@/context/data-provider";
import { useToast } from "@/context/toast-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TopRatedScreen() {
	const { colorScheme, mutedColor, shadowColor, textColor } = useColorScheme();
	const { categories } = useDataProvider();
	const router = useRouter();
	const showToast = useToast();

	const [stores, setStores] = useState<any[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const fetchStores = async () => {
			const stores = await getStores();
			setStores(stores);
		};
		fetchStores();
	}, []);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const toggleDropdown = () => {
		setIsExpanded(!isExpanded);
	};

	const handlePressComingSoon = (category: any) => {
		showToast("Coming Soon!");
	};

	const visibleCategories = isExpanded ? categories : categories.slice(0, 20);

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{ paddingBottom: 100 }}
		>
			<View className="justify-between px-6 mt-6 pb-14 flex flex-col gap-y-10">
				<View className="flex flex-col ">
					<SectionHeader title="By category" />

					<View className="flex flex-col gap-2">
						<CategoryList showComingSoon limit={6} />
					</View>
				</View>

				<View className="flex flex-col w-full">
					<SectionHeader title="By store" />

					<StoreList />
				</View>
			</View>
		</ScrollView>
	);
}
