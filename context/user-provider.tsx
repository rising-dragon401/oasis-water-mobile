"use client";

import {
	calculateUserScores,
	createUsername,
	getCurrentUserData,
	getSubscription,
	getUserFavorites,
	getUserTapScore,
} from "actions/user";
import React, {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { useSupabase } from "./supabase-provider";

import { supabase } from "@/config/supabase";

interface UserContextType {
	uid: string | null | undefined;
	provider: string | null | undefined;
	user: any;
	userData: any;
	tapScore: any;
	userScores: any;
	userFavorites: any[] | null | undefined;
	subscription: boolean;
	subscriptionData: any | null | undefined;
	subscriptionProvider: SubscriptionProviderType;
	refreshUserData: (
		type?: "all" | "favorites" | "scores" | "subscription",
	) => Promise<void>;
	fetchUserFavorites: (uid: string | null) => Promise<void>;
	fetchUserScores: (userTapId?: any) => Promise<void>;
	fetchSubscription: (uid: string | null) => Promise<any | null>;
	setSubscription: (value: boolean) => void;
	fetchUserData: (uid: string | null) => Promise<any | null>;
	logout: () => void;
}

type SubscriptionProviderType = null | "revenue_cat" | "stripe";

const UserContext = createContext<UserContextType | null>(null);

export const useUserProvider = () => {
	const context = useContext(UserContext);
	if (context === null) {
		throw new Error("useUserProvider must be used within a UserProvider");
	}
	return context;
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { session, user } = useSupabase();

	const [activeSession, setActiveSession] = useState<any>(null);
	const [userId, setUserId] = useState<string | null | undefined>(null);
	const [provider, setProvider] = useState<any>(null);
	const [subscription, setSubscription] = useState<boolean>(false);
	const [subscriptionData, setSubscriptionData] = useState<any>(null);
	const [subscriptionProvider, setSubscriptionProvider] =
		useState<SubscriptionProviderType>(null);
	const [userData, setUserData] = useState<any>(null);
	const [tapScore, setTapScore] = useState<any>({
		id: null,
		score: null,
		healthEffects: [],
		contaminants: [],
	});
	const [userScores, setUserScores] = useState<any>({
		showersScore: 0,
		waterFilterScore: 0,
		bottledWaterScore: 0,
		overallScore: 0,
	});
	const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(
		null,
	);

	// set active session and refresh user data
	useEffect(() => {
		setActiveSession(session);

		if (session && session !== activeSession) {
			initUser(session);
		} else if (session === null) {
			clearUserData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	// subscription listener
	useEffect(() => {
		supabase
			.channel("subscriptions")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "subscriptions" },
				(payload) => {
					if (userId) {
						fetchSubscription(userId);
					}
				},
			)
			.subscribe();
	}, [userId]);

	// handle generate username for all users
	useEffect(() => {
		if (userData && userId) {
			handleGenerateUsername(userData, userId);
		}
	}, [userData, userId]);

	useEffect(() => {
		if (userData && userData?.tap_location_id) {
			// Each location needs lat/long to get nearest location
			// addLatLongToEachLocation();

			const tapLocationId = userData?.tap_location_id;
			fetchUserScores(tapLocationId);
		}
	}, [userData, userId, userFavorites]);

	const handleGenerateUsername = async (data: any, uid: string) => {
		// check for username, create if none exists
		if (!data?.username) {
			const username = await createUsername(uid);
			if (username) {
				setUserData({ ...data, username });
			}
		}
	};

	useEffect(() => {
		console.log("subscription", subscription);
	}, [subscription]);

	const initUser = async (session: any) => {
		setUserId(session.user?.id);

		fetchUserData(session.user?.id);
		fetchSubscription(session.user?.id);
		fetchUserFavorites(session.user?.id);
		fetchUserScores(session.user?.id);

		setProvider(session.user?.app_metadata?.provider);
	};

	const fetchUserData = async (uid?: string | null) => {
		console.log("fetching user data");
		if (!uid) {
			return;
		}

		const data = await getCurrentUserData(uid);
		setUserData(data);

		fetchUserFavorites(uid);
	};

	const fetchUserFavorites = async (uid: string | null) => {
		if (!uid) {
			return;
		}

		const favs = await getUserFavorites(uid);
		setUserFavorites(favs);
	};

	const fetchSubscription = async (uid: string | null) => {
		const data = await getSubscription(uid);

		if (data && data?.success) {
			setSubscription(true);
			setSubscriptionData(data);

			const provider =
				data?.data?.metadata && data?.data?.metadata?.provider === "revenue_cat"
					? "revenue_cat"
					: "stripe";

			setSubscriptionProvider(provider);
		} else {
			setSubscription(false);
		}
		return data;
	};

	const fetchUserScores = async (userTapId?: any) => {
		const tapId = userData?.tap_location_id;

		if (!tapId) {
			return;
		}

		const data = await getUserTapScore(tapId);

		setTapScore(data);

		if (userFavorites && data && userId) {
			const scores = await calculateUserScores(userFavorites, data);

			setUserScores(scores);
		}
	};

	const refreshUserData = useCallback(
		async (type: "all" | "favorites" | "scores" | "subscription" = "all") => {
			const userId = user?.id;

			if (!userId) {
				return;
			}

			const promises = [];

			if (type === "all" || type === "subscription") {
				promises.push(fetchSubscription(userId));
			}
			if (type === "all" || type === "favorites") {
				promises.push(fetchUserFavorites(userId));
			}
			if (type === "all" || type === "scores") {
				promises.push(fetchUserScores(userId));
			}
			if (type === "all") {
				promises.push(fetchUserData(userId));
			}

			await Promise.all(promises);
		},
		[user?.id],
	);

	const logout = useCallback(async () => {
		clearUserData();
		await supabase.auth.signOut();
		setSubscription(false);
	}, [supabase.auth]);

	const clearUserData = () => {
		setUserData(null);
		setUserId(null);
		setUserFavorites(null);
		setActiveSession(null);
		setSubscription(false);
		setUserScores({
			showersScore: 0,
			waterFilterScore: 0,
			bottledWaterScore: 0,
			overallScore: 0,
		});

		setTapScore(null);
	};

	const context = useMemo(
		() => ({
			user,
			provider,
			uid: userId,
			subscription,
			subscriptionData,
			userData,
			userFavorites,
			subscriptionProvider,
			tapScore,
			userScores,
			refreshUserData,
			fetchUserFavorites,
			fetchUserScores,
			fetchSubscription,
			setSubscription,
			fetchUserData,
			logout,
		}),
		[
			user,
			provider,
			userId,
			subscription,
			subscriptionData,
			userData,
			userFavorites,
			subscriptionProvider,
			tapScore,
			userScores,
			refreshUserData,
			fetchUserFavorites,
			fetchUserScores,
			fetchSubscription,
			setSubscription,
			fetchUserData,
			logout,
		],
	);

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
};

export default UserProvider;
