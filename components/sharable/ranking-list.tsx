"use client";

import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import ItemPreviewCard from "./item-preview-card";
import Typography from "./typography";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProvider } from "@/context/user-provider";

import { Octicons } from "@expo/vector-icons";

import { useEffect, useMemo, useState } from "react";
import UpgradeButton from "./upgrade-button";

type Props = {
	title: string;
	items: any[] | null;
	loading: boolean;
};

export default function RankingList({ title, items, loading }: Props) {
	const router = useRouter();
	const { subscription } = useUserProvider();

	const [sortMethod, setSortMethod] = useState("name");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (subscription) {
			setSortMethod("score");
		}
	}, [subscription]);

	const sorted = useMemo(() => {
		if (!items) return null;

		return [...items].sort((a, b) => {
			if (sortMethod === "score") {
				if (a.score === null) return 1;
				if (b.score === null) return -1;
				return b.score - a.score;
			} else if (sortMethod === "name") {
				return a.name.localeCompare(b.name);
			}
			return 0;
		});
	}, [items, sortMethod]);

	const handleClickSortByScore = () => {
		if (subscription) {
			setSortMethod("score");
		} else {
			router.push("/subscribeModal");
		}
	};

	const itemsWithNoReports = sorted?.filter((item) => item.score === null);

	return (
		<View className="pb-14">
			<View className="py-4 mb-2 flex flex-row justify-between">
				<Typography size="3xl" fontWeight="normal">
					{title}
				</Typography>

				<View className="flex flex-row gap-4">
					<DropdownMenu
						open={isOpen}
						onOpenChange={setIsOpen}
						className="relative"
					>
						<DropdownMenuTrigger className="flex flex-row items-center gap-2">
							<Typography size="base" fontWeight="normal">
								Sort
							</Typography>
							<Octicons name="chevron-down" size={16} color="black" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onPress={handleClickSortByScore}
								className="hover:cursor-pointer"
							>
								{!subscription && (
									<Octicons name="lock" size={16} color="black" />
								)}
								<Typography size="base" fontWeight="normal">
									Score
								</Typography>
							</DropdownMenuItem>
							<DropdownMenuItem
								onPress={() => {
									setSortMethod("name");
								}}
								className="hover:cursor-pointer"
							>
								<Typography size="base" fontWeight="normal">
									Name
								</Typography>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</View>
			</View>

			{!subscription && (
				<View className="w-full justify-center flex flex-row gap-4 mb-8">
					<UpgradeButton label="Unlock ranked list sorted by score" />
				</View>
			)}

			{!loading ? (
				<>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						{sorted &&
							sorted
								.filter((item) => item.score !== null)
								.filter((item) => item?.is_draft !== true)
								.map((item) => (
									<View
										key={item.id}
										style={{ width: "50%" }}
										className="flex mb-24"
									>
										<ItemPreviewCard item={item} size="md" />
									</View>
								))}
					</View>

					{itemsWithNoReports && itemsWithNoReports.length > 0 && (
						<>
							<View className="pt-4 pb-8 flex flex-row justify-between mt-24">
								<Typography size="3xl" fontWeight="normal">
									⚠️ NO REPORTS LOCATED
								</Typography>
							</View>

							<View className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 pb-24">
								{sorted &&
									sorted
										.filter((item) => item.score === null)
										.map((item) => (
											<ItemPreviewCard
												key={item.id}
												item={item}
												size="md"
												showWarning={true}
											/>
										))}
							</View>
						</>
					)}
				</>
			) : (
				<ActivityIndicator size="large" color="#000" />
			)}
		</View>
	);
}
