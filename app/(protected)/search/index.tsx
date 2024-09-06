import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import Search from "@/components/sharable/search";
import { H2, H4, Muted, P, Small } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { CATEGORIES } from "@/lib/constants/categories";
import { getEntry } from "actions/blogs";
import axios from "axios";

import { getFeaturedUsers } from "actions/admin";

export default function TabOneScreen() {
	const { userData, subscription, uid } = useUserProvider();
	const router = useRouter();
	const pathname = usePathname();

	const [people, setPeople] = useState<any[]>([]);
	const [blogs, setBlogs] = useState<any[]>([]);

	useEffect(() => {
		getPeople();
		getBlogs();
	}, []);

	// show review modal if user has not reviewed the app
	useEffect(() => {
		if (
			userData &&
			uid &&
			subscription &&
			!userData?.has_reviewed_app &&
			pathname !== "/reviewModal"
		) {
			router.push("/reviewModal");
		}
	}, [userData, subscription, uid]);

	async function getBlogs() {
		try {
			try {
				const response = await axios.get(
					"https://favorable-chickens-2e4f30c189.strapiapp.com/api/articles",
				);
				const blogEntries = await Promise.all(
					response.data.data.map(async (item: any) => {
						const entry = await getEntry(item.id);
						return entry;
					}),
				);
				setBlogs(blogEntries);
			} catch (error) {
				console.error("Error fetching food data:", error);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	async function getPeople() {
		const data = await getFeaturedUsers();

		setPeople(data || []);
	}

	return (
		<View className="flex flex-col h-full items-center my-6 p-4">
			<H2 className="text-center max-w-xs border-none pb-0">
				Search healthy water
			</H2>

			<Muted className="text-center mb-4 max-w-md">
				Discover the best water products based on science.
			</Muted>

			<View className="mb-10 w-[90%] z-40">
				<Search />
			</View>

			<View className="flex-1 flex-col -mb-12">
				<View className="flex flex-row justify-between w-full items-center">
					<H4 className="text-left mb-4">Product categories</H4>
					<Link href="/(protected)/top-rated">
						<Small className="text-secondary italic">explore</Small>
					</Link>
				</View>
				<FlatList
					data={CATEGORIES.sort(
						(a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0),
					)}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 8,
					}}
					className="overflow-x-scroll"
					renderItem={({ item: category }) => (
						<View className="mr-4 w-[180px] h-[160px] py-2 rounded-xl">
							<Link
								key={category.id}
								href={`/search/top-rated/${category.id}`}
								className=""
							>
								<View className="relative w-full aspect-square flex items-center justify-center rounded-xl bg-card">
									<Image
										source={{ uri: category.image }}
										alt={category.title}
										style={{
											width: "70%",
											height: "80%",
											borderRadius: 4,
										}}
									/>
								</View>
							</Link>
							<P className="text-left text-lg font-medium">{category.title}</P>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View className="flex-1 w-full justify-start">
				<View className="flex flex-row justify-between w-full items-center">
					<H4 className="text-left mb-4">Research</H4>
					<Link href="/(protected)/research">
						<Small className="text-secondary italic">view all</Small>
					</Link>
				</View>
				<FlatList
					data={blogs}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 8,
					}}
					className="overflow-x-scroll"
					renderItem={({ item }) => (
						<Link
							href={`/search/article/${item.id}`}
							className="flex flex-col mr-4"
						>
							<View style={{ width: 200 }}>
								<View
									style={{
										width: 200,
										height: 140,
										borderRadius: 20,
										overflow: "hidden",
									}}
								>
									<Image
										source={{ uri: item.cover }}
										alt={item.attributes.title}
										style={{
											width: "100%",
											height: "100%",
											borderRadius: 20,
										}}
									/>
								</View>

								<View style={{ width: 200 }}>
									<P
										className="mt-2 text-left"
										numberOfLines={2}
										ellipsizeMode="tail"
									>
										{item.attributes.title}
									</P>
								</View>
							</View>
						</Link>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</View>
	);
}
