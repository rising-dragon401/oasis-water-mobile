import { isUserLoggedIn } from "@/actions/user";
import { ItemForm } from "@/components/sharable/item-form";
import {
	useGlobalSearchParams,
	useLocalSearchParams,
	useNavigation,
	usePathname,
	useRouter,
} from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function Page() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	const pathname = usePathname();
	const navigation = useNavigation();
	const router = useRouter();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	// check if user is logged in
	// only auth users can view items
	useEffect(() => {
		const checkLogin = async () => {
			if (!pathname.includes("/item")) {
				return;
			}

			const loggedIn = await isUserLoggedIn();
			if (!loggedIn) {
				Alert.alert(
					"Sign in to view",
					"You need to be signed in to view items",
					[
						{
							text: "Go back",
							onPress: () => navigation.goBack(),
							style: "cancel",
						},
						{
							text: "Sign in",
							onPress: () => router.push("/(public)/sign-in"),
						},
					],
				);
			}
		};
		checkLogin();
	}, [glob, pathname]);

	return <ItemForm id={id} />;
}
