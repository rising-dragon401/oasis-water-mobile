import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import { BrandForm } from "@/components/sharable/brand-form";

export default function BrandPage() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"";

	return <BrandForm id={id} />;
}
