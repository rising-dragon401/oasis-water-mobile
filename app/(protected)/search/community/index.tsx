import { useCallback, useEffect, useState } from "react";
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	View,
} from "react-native";

import { getLatestActions } from "@/actions/global";
import CommunityActionCard from "@/components/sharable/community-action-card";
import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
export default function CommunityPage() {
	const [liveActions, setLiveActions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [limit, setLimit] = useState(25);

	const fetchActions = useCallback(async () => {
		setLoading(true);
		const latestActions = await getLatestActions({ limit });
		if (latestActions) {
			setLiveActions((prevActions) => [...prevActions, ...latestActions]);
		}
		setLoading(false);
	}, [limit]);

	useEffect(() => {
		fetchActions();
	}, [fetchActions]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setLimit(25);
		fetchActions().then(() => setRefreshing(false));
	}, [fetchActions]);

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const { layoutMeasurement, contentOffset, contentSize } =
				event.nativeEvent;
			if (
				layoutMeasurement.height + contentOffset.y >=
				contentSize.height - 20
			) {
				setLimit((prevLimit) => prevLimit + 25);
			}
		},
		[],
	);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingTop: 18,
				paddingBottom: 80,
				paddingHorizontal: 20,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			onScroll={handleScroll}
			scrollEventThrottle={16}
		>
			<StickyHeader title="Community" hideMargin />

			<View className="h-4" />

			<View className="flex flex-col gap-4">
				{loading &&
					Array.from({ length: 12 }).map((_, index) => (
						<Skeleton
							key={index}
							height={60}
							width="100%"
							style={{ borderRadius: 14 }}
						/>
					))}

				{!loading &&
					liveActions.map((action) => (
						<View key={action.id}>
							<CommunityActionCard {...action} />
						</View>
					))}
			</View>
		</ScrollView>
	);
}
