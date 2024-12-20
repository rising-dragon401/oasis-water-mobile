import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, GestureResponderEvent, TouchableOpacity } from "react-native";

import {
	addFavorite,
	calculateUserScore,
	removeFavorite,
	updateUserData,
} from "@/actions/user";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	item: any;
	size?: number;
};

export default function FavoriteButton({ item, size = 18 }: Props) {
	const { userFavorites, uid, userData, refreshUserData } = useUserProvider();
	const router = useRouter();
	const { iconColor } = useColorScheme();
	const showToast = useToast();

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

	const handleUpdateLocation = async (location: any) => {
		try {
			if (!uid) {
				return false;
			}

			const res = await updateUserData(uid, "tap_location_id", location.id);

			if (res) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error("Error updating location", error);
			return false;
		}
	};

	const handleFavoriteClick = async (e: GestureResponderEvent) => {
		e.preventDefault();

		if (isItemInFavorites || selectedTapLocation) {
			showToast("Already in your favorites");
			return;
		}

		if (!uid || !userData) {
			Alert.alert(
				"Sign in to save",
				"Create an account or sign in to save this product to your Oasis",
				[
					{
						text: "OK",
						onPress: () => router.push("/(public)/sign-in"),
					},
				],
			);
			router.push("/(public)/sign-in");
			return;
		}

		setLoadingFavorite(true);

		if (item.type === "tap_water") {
			const res = await handleUpdateLocation(item);
			if (res) {
				refreshUserData("userData");
				showToast("Tap water location updated");
			}
		} else {
			try {
				if (isItemInFavorites) {
					setIsItemInFavorites(false);
					await removeFavorite(uid, item.type, item.id);
				} else {
					setIsItemInFavorites(true);
					await addFavorite(uid, item.type, item.id);
				}
				refreshUserData("favorites");
				calculateUserScore(uid);
			} catch (error) {
				console.error("Error updating favorites", error);
			}
		}

		setLoadingFavorite(false);
	};

	const isTapWater = item.type === "tap_water";
	const selectedTapLocation =
		isTapWater && userData?.tap_location_id === item.id;

	return (
		<TouchableOpacity
			onPress={handleFavoriteClick}
			className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
		>
			{isItemInFavorites || selectedTapLocation ? (
				<Feather name="check" size={18} color={iconColor} />
			) : (
				<Feather name="plus" size={18} color={iconColor} />
			)}
		</TouchableOpacity>
	);
}
