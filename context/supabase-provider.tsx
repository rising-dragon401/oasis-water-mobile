import { Session, User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import { usePathname, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/config/supabase";

// Splash screen stuck and loading : https://github.com/expo/fyi/blob/main/splash-screen-hanging.md
SplashScreen.preventAutoHideAsync();

// type oAuthProviders = "google";

type SupabaseContextProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
	signInWithApple: () => Promise<void>;
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
	signInWithGoogle: async () => {},
	signInWithApple: async () => {},
	signOut: async () => {},
	getGoogleOAuthUrl: async () => "",
	setOAuthSession: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const pathname = usePathname();

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

	const signInWithApple = async () => {
		console.log("signInWithApple");

		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			// Sign in via Supabase Auth.
			if (credential.identityToken) {
				const {
					error,
					data: { user },
				} = await supabase.auth.signInWithIdToken({
					provider: "apple",
					token: credential.identityToken,
				});

				console.log(JSON.stringify({ error, user }, null, 2));

				if (!error) {
					// User is signed in.
				}
			} else {
				throw new Error("No identityToken.");
			}
		} catch (e: any) {
			console.log("signInWithApple: ", e);

			if (e.code === "ERR_REQUEST_CANCELED") {
				// handle that the user canceled the sign-in flow
			} else {
				// handle other errors
			}
		}
	};

	const onSignInWithGoogle = async () => {
		try {
			const url = await getGoogleOAuthUrl();
			if (!url) return;

			const schemaUrl = `${process.env.EXPO_PUBLIC_URL}://google-auth`;

			const result = await WebBrowser.openAuthSessionAsync(url, schemaUrl, {
				showInRecents: true,
			});

			if (result.type === "success") {
				const data = extractParamsFromUrl(result.url);

				if (!data.access_token || !data.refresh_token) return;

				setOAuthSession({
					access_token: data.access_token,
					refresh_token: data.refresh_token,
				});

				// You can optionally store Google's access token if you need it later
				SecureStore.setItemAsync(
					"google-access-token",
					JSON.stringify(data.provider_token),
				);
			}
		} catch (error) {
			// Handle error here
			console.log(error);
		} finally {
		}
	};

	const extractParamsFromUrl = (url: string) => {
		const params = new URLSearchParams(url.split("#")[1]);
		const data = {
			access_token: params.get("access_token"),
			expires_in: parseInt(params.get("expires_in") || "0"),
			refresh_token: params.get("refresh_token"),
			token_type: params.get("token_type"),
			provider_token: params.get("provider_token"),
		};

		return data;
	};

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

			// HACK: Prevents app from opening 404 page when logging in
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 100);
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			if (!initialized) return;

			console.log("fetchData");

			const inProtectedGroup = segments[0] === "(protected)";

			if (session && !inProtectedGroup) {
				const { data: userData, error } = await supabase
					.from("users")
					.select("is_onboarded")
					.eq("id", session.user.id)
					.single();

				if (error) {
					console.log("Error fetching user data:", error);
					return;
				}

				if (userData && userData?.is_onboarded) {
					if (pathname !== "/(protected)/search") {
						router.replace("/(protected)/search");
					}
				} else {
					if (pathname !== "/(public)/onboarding") {
						router.replace("/(public)/onboarding");
					}
				}
			} else if (!session) {
				if (pathname !== "/(public)/welcome") {
					router.replace("/(public)/welcome");
				}
			}

			/* HACK: Something must be rendered when determining the initial auth state... 
			instead of creating a loading screen, we use the SplashScreen and hide it after
			a small delay (500 ms)
			*/
		};

		fetchData();
	}, [initialized, session]);

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				signInWithGoogle: onSignInWithGoogle,
				signInWithApple,
				signOut,
				getGoogleOAuthUrl,
				setOAuthSession,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
