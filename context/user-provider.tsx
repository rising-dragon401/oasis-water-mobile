"use client";

import {
	calculateUserScores,
	createUsername,
	getCurrentUserData,
	getUserFavorites,
	getUserTapScore,
	getUserUpvoted,
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

import { checkSubscription } from "@/actions/subscription";
import { supabase } from "@/config/supabase";

interface UserContextType {
	uid: string | null | undefined;
	provider: string | null | undefined;
	user: any;
	userData: any;
	tapScore: any;
	userScores: any;
	userRequests: any;
	userFavorites: any[] | null | undefined;
	subscription: boolean;
	subscriptionData: any | null | undefined;
	subscriptionProvider: SubscriptionProviderType;
	refreshUserData: (
		type?:
			| "all"
			| "favorites"
			| "scores"
			| "subscription"
			| "userData"
			| "requests",
	) => Promise<void>;
	fetchUserFavorites: (uid: string | null) => Promise<void>;
	fetchUserScores: (userTapId?: any) => Promise<void>;
	fetchSubscription: ({
		userId,
		rcCustomerId,
	}: {
		userId?: string;
		rcCustomerId?: string;
	}) => Promise<any | null>;
	setSubscription: (value: boolean) => void;
	fetchUserData: (uid: string | null) => Promise<any | null>;
	logout: () => void;
}

type SubscriptionProviderType = null | "revenue_cat" | "stripe";

interface SubscriptionResponse {
	apiStatus: number;
	message?: string;
	data?: {
		status?: string;
		[key: string]: any;
	} | null; // Allow data to be null
}

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
	const [userRequests, setUserRequests] = useState<any>({
		items: [],
		filters: [],
		tapLocations: [],
	});

	// Admin scripts
	useEffect(() => {
		// getIngIdsByName();
	}, []);

	// set active session and refresh user data
	useEffect(() => {
		if (session) {
			initUser(session);
		} else {
			clearUserData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	// handle generate username for all users
	useEffect(() => {
		if (userData && userId && !userData?.username) {
			handleGenerateUsername(userData, userId);
		}
	}, [userData, userId]);

	// Refetch user scores when favorites change
	useEffect(() => {
		if (userData) {
			const tapLocationId = userData?.tap_location_id;
			fetchUserScores(tapLocationId);
		}
	}, [userId, userFavorites]);

	const handleGenerateUsername = async (data: any, uid: string) => {
		// check for username, create if none exists
		if (!data?.username) {
			const username = await createUsername(uid);
			if (username) {
				setUserData({ ...data, username });
			}
		}
	};

	const initUser = async (session: any) => {
		setUserId(session?.user?.id);
		setProvider(session?.user?.app_metadata?.provider);

		const userData = await fetchUserData(session?.user?.id);
		fetchSubscription({
			userId: session.user?.id,
			rcCustomerId: userData?.rc_customer_id,
		});

		fetchUserFavorites(session?.user?.id);
		fetchUserUpvoted(session?.user?.id);
	};

	const fetchUserData = async (uid?: string | null) => {
		console.log("fetching user data");
		if (!uid) {
			return;
		}

		const data = await getCurrentUserData(uid);

		setUserData(data);
		fetchUserScores(data?.tap_location_id);
		return data;
	};

	const fetchUserFavorites = async (uid: string | null) => {
		if (!uid) {
			return;
		}

		const favs = await getUserFavorites(uid);
		setUserFavorites(favs);
	};

	const fetchSubscription = async ({
		userId,
		rcCustomerId,
	}: {
		userId?: string;
		rcCustomerId?: string;
	}) => {
		try {
			const thisUserId = userId || session?.user?.id || null;
			const thisRcCustomerId = rcCustomerId || userData?.rc_customer_id || null;

			console.log("thisUserId:", thisUserId);
			// console.log("userData:", userData);
			// console.log("thisRcCustomerId:", thisRcCustomerId);

			// if (!thisUserId) {
			// 	throw new Error("fetchSubscription failed: No user ID provided");
			// }

			// console.log("fetchSubscription", userId, rcCustomerId);

			const response: SubscriptionResponse = await checkSubscription(
				thisUserId,
				thisRcCustomerId,
			);

			console.log("checkSubscription: ", JSON.stringify(response, null, 2));

			if (response && response?.apiStatus === 200) {
				const status = response.data?.status;
				if (status === "active" || status === "trialing") {
					setSubscription(true);
				} else {
					setSubscription(false);
				}
			} else {
				// mark as false if cannot fetch subscription data
				setSubscription(false);
			}
		} catch (error) {
			// console.error("Error fetching subscription:", error);
		}
	};

	const fetchUserScores = async (userTapId?: any) => {
		const tapId = userTapId || userData?.tap_location_id;

		const tapData = await getUserTapScore(tapId);

		setTapScore(tapData);

		const scores = await calculateUserScores(userFavorites, tapData);

		// console.log("scores", scores);

		setUserScores(scores);
	};

	const fetchUserUpvoted = async (userId: string) => {
		const upvoted = await getUserUpvoted(userId);
		setUserRequests(upvoted);
	};

	const refreshUserData = useCallback(
		async (
			type:
				| "all"
				| "favorites"
				| "scores"
				| "subscription"
				| "requests"
				| "userData" = "all",
		) => {
			const userId = user?.id;

			if (!userId) {
				return;
			}

			const promises = [];

			if (type === "all" || type === "subscription") {
				promises.push(
					fetchSubscription({
						userId,
					}),
				);
			}
			if (type === "all" || type === "favorites") {
				promises.push(fetchUserFavorites(userId));
			}
			if (type === "all" || type === "userData") {
				promises.push(fetchUserData(userId));
			}
			if (type === "all" || type === "requests") {
				promises.push(fetchUserUpvoted(userId));
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
			userRequests,
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
			userRequests,
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
