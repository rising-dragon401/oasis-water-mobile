import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
} from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { AppleAuthButton } from "@/components/sharable/apple-auth-button";
import BackButton from "@/components/sharable/back-button";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signInWithPassword, signInWithGoogle } = useSupabase();
	const router = useRouter();
	const { colorScheme } = useColorScheme();

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
			Alert.alert(
				"Sign In Error",
				error.message,
				[{ text: "OK", onPress: () => console.log("OK Pressed") }],
				{ cancelable: false },
			);
		}
	}

	const onSignInWithGoogle = async () => {
		setLoading(true);
		await signInWithGoogle();
		setLoading(false);
	};

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	return (
		<SafeAreaView className="flex-1 flex-col p-4">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
			>
				<ScrollView contentContainerClassName="flex-grow p-4">
					<View className="flex-1">
						<View className="flex flex-col items-start justify-start">
							<BackButton />
							<H1 className="self-start">Sign In</H1>
						</View>
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

					<View className="gap-y-4 mt-2">
						<Button
							size="default"
							variant="default"
							onPress={form.handleSubmit(onSubmit)}
							label="Sign In"
						>
							{form.formState.isSubmitting && (
								<ActivityIndicator size="small" />
							)}
						</Button>

						<Separator orientation="horizontal" />
						<Button
							variant="outline"
							loading={loading}
							onPress={() => onSignInWithGoogle()}
							label="Sign In with Google"
							icon={<FontAwesome6 name="google" size={12} color={iconColor} />}
							iconPosition="left"
						/>
						<AppleAuthButton />

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
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
