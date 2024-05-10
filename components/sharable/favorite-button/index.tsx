import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, GestureResponderEvent, TouchableOpacity } from "react-native";

import { addFavorite, removeFavorite } from "@/actions/user";
import { Octicons } from "@expo/vector-icons";

import { useUserProvider } from "@/context/user-provider";
import { mutate } from "swr";

type Props = {
	item: any;
	size?: number;
};

export default function FavoriteButton({ item, size = 18 }: Props) {
	const { userFavorites, uid, userData, subscription, fetchUserFavorites } =
		useUserProvider();
	const router = useRouter();

	const isItemInFavorites = useMemo(
		() =>
			userFavorites &&
			userFavorites.some(
				(favorite: any) =>
					favorite && favorite.id === item.id && favorite.type === item.type,
			),
		[userFavorites, item],
	);

	const handleFavoriteClick = async (e: GestureResponderEvent) => {
		e.preventDefault();

		if (!uid || !userData) {
			alert(
				"Please sign in and subscribe to add to this product to your Oasis.",
			);
			router.push("/(public)/sign-in");
			return;
		}

		if (!subscription) {
			Alert.alert(
				"Subscription Required",
				"Please subscribe to add products to your Oasis",
				[{ text: "OK", onPress: () => router.push("/subscribeModal") }],
			);
			return;
		}

		try {
			if (isItemInFavorites) {
				await removeFavorite(uid, item.type, item.id);
			} else {
				await addFavorite(uid, item.type, item.id);
			}
			mutate("userFavorites");
			fetchUserFavorites(uid);
		} catch (error) {
			console.error("Error updating favorites", error);
		}
	};

	return (
		<TouchableOpacity onPress={handleFavoriteClick}>
			{isItemInFavorites ? (
				<Octicons name="check-circle" size={20} color="black" />
			) : (
				<Octicons name="plus-circle" size={20} color="black" />
			)}
		</TouchableOpacity>
	);
}
