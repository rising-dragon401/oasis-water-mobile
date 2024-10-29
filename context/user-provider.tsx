"use client";

import {
	createUsername,
	getCurrentUserData,
	getSubscription,
	getUserFavorites,
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
	userFavorites: any[] | null | undefined;
	subscription: boolean;
	subscriptionData: any | null | undefined;
	subscriptionProvider: SubscriptionProviderType;
	refreshUserData: () => void;
	fetchUserFavorites: (uid: string | null) => Promise<void>;
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
	const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(
		null,
	);

	// set active session and refresh user data
	useEffect(() => {
		setActiveSession(session);

		if (session && session !== activeSession) {
			initUser(session);
			refreshUserData(session.user.id);
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
		setUserId(session.user?.id);
		setProvider(session.user?.app_metadata?.provider);
	};

	const fetchUserData = async (uid?: string | null) => {
		if (!uid) {
			return;
		}

		const data = await getCurrentUserData(uid);
		setUserData(data);
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
			const provider =
				data?.data?.metadata && data?.data?.metadata?.provider === "revenue_cat"
					? "revenue_cat"
					: "stripe";

			setSubscriptionProvider(provider);

			if (provider === "revenue_cat") {
				setSubscription(true);
			} else {
				setSubscription(false);
			}

			// setSubscription(true);
			setSubscriptionData(data);
		} else {
			setSubscription(false);
		}
		return data;
	};

	const refreshUserData = useCallback(
		async (uid?: string | null) => {
			if (!uid) {
				return;
			}
			const userId = uid ?? null;

			await Promise.all([
				fetchSubscription(userId),
				fetchUserData(userId),
				fetchUserFavorites(userId),
			]);
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
			refreshUserData,
			fetchUserFavorites,
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
			refreshUserData,
			fetchUserFavorites,
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
