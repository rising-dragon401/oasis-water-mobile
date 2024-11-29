import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import { StoreForm } from "@/components/sharable/store-form";

export default function StorePage() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"";

	return <StoreForm id={id} />;
}
