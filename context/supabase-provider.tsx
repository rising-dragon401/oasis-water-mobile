import { Session, User } from "@supabase/supabase-js";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

// type oAuthProviders = "google";

type SupabaseContextProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	// signInWithOAuth: (provider: oAuthProviders) => Promise<void>;
	signOut: () => Promise<void>;

	getGoogleOAuthUrl: () => Promise<string | null>;
	setOAuthSession: (tokens: {
		access_token: string;
		refresh_token: string;
	}) => Promise<void>;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	signUp: async () => {},
	signInWithPassword: async () => {},
	// signInWithOAuth: async () => {},
	signOut: async () => {},
	getGoogleOAuthUrl: async () => "",
	setOAuthSession: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signInWithPassword = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const getGoogleOAuthUrl = async (): Promise<string | null> => {
		const result = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${process.env.EXPO_PUBLIC_URL}://google-auth`,
			},
		});

		return result.data.url;
	};

	const setOAuthSession = async (tokens: {
		access_token: string;
		refresh_token: string;
	}) => {
		const { data, error } = await supabase.auth.setSession({
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
		});

		if (error) throw error;

		setSession(data.session);
	};

	// const signInWithOAuth = async (provider: "google") => {
	// 	const { error } = await supabase.auth.signInWithOAuth({
	// 		provider,
	// 	});
	// 	if (error) {
	// 		throw error;
	// 	}
	// };

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	};

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			setUser(session ? session.user : null);
			setInitialized(true);
		});
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (!initialized) return;

		const inProtectedGroup = segments[0] === "(protected)";

		if (session && !inProtectedGroup) {
			router.replace("/(protected)/search");
		} else if (!session) {
			router.replace("/(public)/welcome");
		}

		/* HACK: Something must be rendered when determining the initial auth state... 
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 500);
	}, [initialized, session]);

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				// signInWithOAuth,
				signOut,
				getGoogleOAuthUrl,
				setOAuthSession,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
