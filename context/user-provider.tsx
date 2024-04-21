"use client";

import {
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
	subscription: any | null | undefined;
	refreshUserData: () => void;
	fetchUserFavorites: (uid: string | null) => Promise<void>; // Updated this line
	logout: () => void;
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

	const [activeSession, setActiveSession] = useState<any>(null);
	const [userId, setUserId] = useState<string | null | undefined>(null);
	const [provider, setProvider] = useState<any>(null);
	const [subscription, setSubscription] = useState<any>(null);
	const [userData, setUserData] = useState<any>(null);
	const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(
		null,
	);

	useEffect(() => {
		setActiveSession(session);

		if (session && session !== activeSession) {
			initUser(session);
			refreshUserData(session.user.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, activeSession]);

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
		setSubscription(data);
		return data;
	};

	const refreshUserData = useCallback(
		async (uid?: string | null) => {
			console.log("refreshUserData");

			let userId = uid ?? null;

			await Promise.all([
				fetchSubscription(userId),
				fetchUserData(userId),
				fetchUserFavorites(userId),
			]);
		},
		[user?.id],
	);

	const logout = useCallback(async () => {
		await supabase.auth.signOut();
		setSubscription(null);
		clearUserData();
	}, [supabase.auth]);

	const clearUserData = () => {
		console.log("clearUserData");
		setUserData(null);
		setUserId(null);
		setUserFavorites(null);
	};

	const context = useMemo(
		() => ({
			user,
			provider,
			uid: userId,
			subscription,
			userData,
			userFavorites,
			refreshUserData,
			fetchUserFavorites,
			logout,
		}),
		[
			user,
			provider,
			userId,
			subscription,
			userData,
			userFavorites,
			refreshUserData,
			fetchUserFavorites,
			logout,
		],
	);

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
};

export default UserProvider;