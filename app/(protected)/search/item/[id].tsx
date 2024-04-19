import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import ItemForm from "@/components/sharable/item-form";

export default function Page() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	console.log("Local:", local.id, "Global:", glob.id);

	return <ItemForm id={local?.id || glob?.id || "1"} />;
}
