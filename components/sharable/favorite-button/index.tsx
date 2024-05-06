import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";

import { addFavorite, removeFavorite } from "@/actions/user";
import { Octicons } from "@expo/vector-icons";

import { useUserProvider } from "@/context/user-provider";
import { mutate } from "swr";

type Props = {
	item: any;
	size?: number;
};

export default function FavoriteButton({ item, size = 18 }: Props) {
	const { userFavorites, uid, userData, fetchUserFavorites } =
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

	const handleFavoriteClick = (e: GestureResponderEvent) => {
		e.preventDefault();

		// first check if user is logged in
		if (!uid || !userData) {
			alert("Please sign in to add to favorites");
			router.push("/(public)/sign-in");
			return;
		}

		if (userFavorites && userFavorites.length === 0) {
			addFavorite(uid, item.type, item.id);
			return;
		}

		if (isItemInFavorites) {
			// Remove item from favorites
			removeFavorite(uid, item.type, item.id);
		} else {
			// Add item to favorites
			console.log("add item to favorites");
			addFavorite(uid, item.type, item.id);
		}

		mutate("userFavorites");
		fetchUserFavorites(uid);
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
