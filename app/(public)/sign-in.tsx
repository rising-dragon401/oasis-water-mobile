import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signInWithPassword, getGoogleOAuthUrl, setOAuthSession } =
		useSupabase();
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		WebBrowser.warmUpAsync();

		return () => {
			WebBrowser.coolDownAsync();
		};
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signInWithPassword(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	// async function onGoogleSignIn() {
	// 	try {
	// 		await signInWithOAuth("google");
	// 	} catch (error: Error | any) {
	// 		console.log(error.message);
	// 	}
	// }

	const onSignInWithGoogle = async () => {
		setLoading(true);
		try {
			const url = await getGoogleOAuthUrl();
			if (!url) return;

			console.log("url: ", url);

			const redirectUrl = Linking.createURL("/");

			console.log("redirectUrl: ", redirectUrl);

			const schemaUrl = `${process.env.EXPO_PUBLIC_URL}://google-auth`;

			console.log("schemaUrl: ", schemaUrl);

			const result = await WebBrowser.openAuthSessionAsync(url, schemaUrl, {
				showInRecents: true,
			});

			console.log("result: ", result);

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
			setLoading(false);
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

	return (
		<SafeAreaView className="flex-1 flex-col bg-background p-4">
			<View className="flex-1">
				<H1 className="self-start">Sign In</H1>
				<Muted className="self-start mb-5">to continue to your Oasis</Muted>
				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormInput
									label="Email"
									placeholder="Email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect={false}
									keyboardType="email-address"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormInput
									label="Password"
									placeholder="Password"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									{...field}
								/>
							)}
						/>
					</View>
				</Form>
			</View>

			<View className="gap-y-4 ">
				<Button
					size="default"
					variant="default"
					onPress={form.handleSubmit(onSubmit)}
					label="Sign In"
				>
					{form.formState.isSubmitting && <ActivityIndicator size="small" />}
				</Button>

				<Separator orientation="horizontal" />
				<Button
					variant="outline"
					onPress={() => onSignInWithGoogle()}
					label="Sign In with Google"
					icon={<FontAwesome6 name="google" size={12} color="black" />}
					iconPosition="left"
				/>

				<Muted
					className="text-center"
					onPress={() => {
						router.replace("/sign-up");
					}}
				>
					Don't have an account?{" "}
					<Muted className="text-foreground">Sign up</Muted>
				</Muted>
			</View>
		</SafeAreaView>
	);
}
