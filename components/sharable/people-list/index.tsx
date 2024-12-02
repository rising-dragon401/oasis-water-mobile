import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import Skeleton from "../skeleton";

import { getFeaturedUsers } from "@/actions/admin";
import { P } from "@/components/ui/typography";

export const PeopleList = () => {
	const router = useRouter();

	const [loadingPeople, setLoadingPeople] = useState<boolean>(false);
	const [people, setPeople] = useState<any[]>([]);

	useEffect(() => {
		fetchPeople();
	}, []);

	async function fetchPeople() {
		setLoadingPeople(true);
		const data = await getFeaturedUsers();

		if (data) {
			setPeople(data);
		}
		setLoadingPeople(false);
	}

	return (
		<View className="flex">
			{loadingPeople ? (
				<FlatList
					data={[1, 2, 3, 4]} //
					horizontal
					renderItem={() => (
						<View className="mr-6 flex flex-col gap-2 justify-center items-center">
							<Skeleton width={70} height={70} style={{ borderRadius: 99 }} />
							<Skeleton width={50} height={8} style={{ borderRadius: 99 }} />
							<Skeleton width={40} height={8} style={{ borderRadius: 99 }} />
						</View>
					)}
					keyExtractor={(item) => item.toString()}
				/>
			) : (
				<FlatList
					data={[...people]}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingLeft: 0,
					}}
					className="overflow-x-scroll"
					renderItem={({ item: user }) => (
						<TouchableOpacity
							key={user.id}
							onPress={() => router.push(`/search/oasis/${user.id}`)}
							className="mr-6 flex flex-col rounded-full items-center justify-center gap-2 h-24"
						>
							<View className="w-16 h-16 rounded-full overflow-hidden">
								<Image
									source={{
										uri: user.avatar_url,
									}}
									alt={user.full_name}
									style={{
										width: "100%",
										height: "100%",
									}}
									placeholder={{ blurhash: "L5H2EC=PM+yV0g-mq.wG9c010J}I" }}
									className="w-full h-full"
								/>
							</View>
							<P className="text-center text-xs w-24" numberOfLines={2}>
								{user.full_name}
							</P>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id}
				/>
			)}
		</View>
	);
};
