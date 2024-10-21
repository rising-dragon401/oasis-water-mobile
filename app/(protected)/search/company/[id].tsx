import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import { CompanyForm } from "@/components/sharable/company-form";

export default function Page() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();

	const name =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"";

	console.log("name: ", name);

	return <CompanyForm companyName={name} />;
}
