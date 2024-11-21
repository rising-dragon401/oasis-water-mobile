"use client";

import {
	calculateUserScores,
	createUsername,
	getCurrentUserData,
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
	userRequests: any;
	userFavorites: any[] | null | undefined;
	refreshUserData: (
		type?: "all" | "favorites" | "scores" | "userData" | "requests",
	) => Promise<void>;
	fetchUserFavorites: (uid: string | null) => Promise<void>;
	fetchUserScores: (userTapId?: any) => Promise<void>;
	fetchUserData: (uid: string | null) => Promise<any | null>;
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

	const [userId, setUserId] = useState<string | null | undefined>(null);
	const [provider, setProvider] = useState<any>(null);
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

		const data = await fetchUserData(session?.user?.id);

		fetchUserFavorites(session?.user?.id);

		if (data?.scores) {
			setUserScores(data?.scores);
		}
		if (data?.tap_score) {
			setTapScore(data?.tap_score);
		}

		if (!data?.tap_score || !data?.scores) {
			fetchUserScores(data?.tap_location_id);
		}
	};

	const fetchUserData = async (uid?: string | null) => {
		console.log("fetching user data");
		if (!uid) {
			return;
		}

		const data = await getCurrentUserData(uid);

		setUserData(data);

		return data;
	};

	const fetchUserFavorites = async (uid: string | null) => {
		if (!uid) {
			return;
		}

		const favs = await getUserFavorites(uid);
		setUserFavorites(favs);
	};

	// Should only be called when tap location or favorites change
	const fetchUserScores = async (userTapId?: any) => {
		if (!userId) {
			return;
		}

		const tapId = userTapId || userData?.tap_location_id;

		const tapData = await getUserTapScore(userId, tapId);

		setTapScore(tapData);

		const scores = await calculateUserScores(userId, userFavorites, tapData);

		setUserScores(scores);
	};

	const refreshUserData = async (
		type: "all" | "favorites" | "scores" | "requests" | "userData" = "all",
	) => {
		const userId = user?.id;

		console.log("refreshUserData", userId);

		if (!userId) {
			return;
		}

		const promises = [];

		if (type === "all" || type === "favorites") {
			promises.push(fetchUserFavorites(userId));
		}
		if (type === "all" || type === "userData") {
			promises.push(fetchUserData(userId));
		}

		// we very rarely want to do this
		if (type === "scores") {
			promises.push(fetchUserScores(userData?.tap_location_id));
		}

		await Promise.all(promises);
	};

	const logout = useCallback(async () => {
		clearUserData();
		await supabase.auth.signOut();
	}, [supabase.auth]);

	const clearUserData = () => {
		setUserData(null);
		setUserId(null);
		setUserFavorites(null);
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
			userData,
			userFavorites,
			tapScore,
			userScores,
			userRequests,
			refreshUserData,
			fetchUserFavorites,
			fetchUserScores,
			fetchUserData,
			logout,
		}),
		[
			user,
			provider,
			userId,

			userData,
			userFavorites,
			tapScore,
			userScores,
			userRequests,
			refreshUserData,
			fetchUserFavorites,
			fetchUserScores,
			fetchUserData,
			logout,
		],
	);

	return (
		<UserContext.Provider value={context}>{children}</UserContext.Provider>
	);
};

export default UserProvider;
