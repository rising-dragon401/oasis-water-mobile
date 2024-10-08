import { isUserLoggedIn } from "@/actions/user";
import { FilterForm } from "@/components/sharable/filter-form";
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
			console.log("pathname", pathname);
			if (!pathname.includes("/filter")) {
				return;
			}

			const loggedIn = await isUserLoggedIn();
			if (!loggedIn) {
				Alert.alert(
					"Sign in to view",
					"You need to be signed in to view filters",
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

	return <FilterForm id={id} />;
}
