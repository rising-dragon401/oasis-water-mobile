import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import { FilterForm } from "@/components/sharable/filter-form";

export default function Page() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	return <FilterForm id={id} />;
}
