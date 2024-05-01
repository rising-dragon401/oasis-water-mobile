import { getRecommendedFilter } from "actions/filters";

import Typography from "components/sharable/typography";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import ItemPreviewCard from "./item-preview-card";
import PaywallContent from "./paywall-content";

type RecommendedFilterRowProps = {
	contaminants: any[];
};

// recommended filter based on contaminants
export default function RecommendedFilterRow({
	contaminants,
}: RecommendedFilterRowProps) {
	const [recommended, setRecommended] = useState<any>([]);

	const fetchRecommendedFilter = async () => {
		const recommended = await getRecommendedFilter(contaminants);

		setRecommended([recommended]);
	};

	useEffect(() => {
		fetchRecommendedFilter();
	}, []);

	return (
		<View className="mb-10">
			<View className="pt-4 pb-8 flex flex-row justify-between">
				<Typography size="2xl" fontWeight="normal">
					Recommended filter
				</Typography>
			</View>

			<PaywallContent label="Unlock recommended filter">
				<View className="flex overflow-x-auto gap-6 hide-scrollbar">
					{recommended &&
						recommended.map((item: any) => (
							<View
								key={item.id}
								className="flex-shrink-0"
								style={{ minWidth: "20%" }}
							>
								<ItemPreviewCard item={item} size="md" />
							</View>
						))}
				</View>
			</PaywallContent>
		</View>
	);
}
