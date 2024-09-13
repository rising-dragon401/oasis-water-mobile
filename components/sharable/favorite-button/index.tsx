import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";

import {
	addFavorite,
	calculateUserScore,
	removeFavorite,
} from "@/actions/user";
import { Octicons } from "@expo/vector-icons";

import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { mutate } from "swr";

type Props = {
	item: any;
	size?: number;
};

export default function FavoriteButton({ item, size = 18 }: Props) {
	const { userFavorites, uid, userData, fetchUserFavorites } =
		useUserProvider();
	const router = useRouter();
	const { iconColor } = useColorScheme();

	const [loadingFavorite, setLoadingFavorite] = useState(false);
	const [isItemInFavorites, setIsItemInFavorites] = useState(false);

	useEffect(() => {
		if (userFavorites) {
			const found = userFavorites.some(
				(favorite: any) =>
					favorite && favorite.id === item.id && favorite.type === item.type,
			);
			setIsItemInFavorites(found);
		}
	}, [userFavorites, item]);

	const handleFavoriteClick = async (e: GestureResponderEvent) => {
		e.preventDefault();

		if (!uid || !userData) {
			alert("Please sign in to add to this product to your Oasis.");
			router.push("/(public)/sign-in");
			return;
		}

		setLoadingFavorite(true);

		try {
			if (isItemInFavorites) {
				setIsItemInFavorites(false);
				await removeFavorite(uid, item.type, item.id);
			} else {
				setIsItemInFavorites(true);
				await addFavorite(uid, item.type, item.id);
			}

			await calculateUserScore(uid);
			mutate(`userFavorites-${uid}`);
			fetchUserFavorites(uid);
		} catch (error) {
			console.error("Error updating favorites", error);
		}

		setLoadingFavorite(false);
	};

	return (
		<TouchableOpacity onPress={handleFavoriteClick}>
			{isItemInFavorites ? (
				<Octicons name="heart-fill" size={24} color={iconColor} />
			) : (
				<Octicons name="heart" size={24} color={iconColor} />
			)}
		</TouchableOpacity>
	);
}
