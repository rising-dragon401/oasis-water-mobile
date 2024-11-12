import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
	getItem: (key: string) => {
		return SecureStore.getItemAsync(key);
	},
	setItem: (key: string, value: string) => {
		SecureStore.setItemAsync(key, value);
	},
	removeItem: (key: string) => {
		SecureStore.deleteItemAsync(key);
	},
};

const supabaseUrl =
	(process.env.EXPO_PUBLIC_API_URL as string) ||
	"https://connect.live-oasis.com";
const supabaseKey =
	(process.env.EXPO_PUBLIC_API_KEY as string) ||
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlucnVxcnltcW9zYmZleWd5a2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjgyMzYsImV4cCI6MjAxNDM0NDIzNn0.CJmoqXKHvE4EcALhbienRCul9yIh1QAOGa1BuBrhHpo";

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		storage: ExpoSecureStoreAdapter as any,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});

// export const supabase = createClient(supabaseUrl, supabaseKey, {
// 	auth: {
// 		storage: AsyncStorage,
// 		autoRefreshToken: true,
// 		persistSession: true,
// 		detectSessionInUrl: false,
// 	},
// });
