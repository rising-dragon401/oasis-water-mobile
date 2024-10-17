import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
} from "react-native";
import * as z from "zod";

import OasisLogo from "@/assets/oasis-word.png";
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

const formSchema = z
	.object({
		email: z.string().email("Please enter a valid email address."),
		password: z
			.string()
			.min(8, "Please enter at least 8 characters.")
			.max(64, "Please enter fewer than 64 characters.")
			.regex(
				/^(?=.*[a-z])/,
				"Your password must have at least one lowercase letter.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Your password must have at least one uppercase letter.",
			)
			.regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Your password must have at least one special character.",
			),
		confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Your passwords do not match.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp, signInWithGoogle } = useSupabase();
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signUp(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
			Alert.alert(
				"Sign Up Error",
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
		<SafeAreaView className="flex-1 p-4">
			<View className="flex-row justify-center items-center mb-4">
				<Image source={OasisLogo} style={{ width: 85, height: 24 }} />
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
			>
				<ScrollView contentContainerClassName="flex-grow p-4">
					<View className="flex-1">
						<View className="flex flex-col items-start justify-start">
							<BackButton />
							<H1 className="self-start">Sign Up</H1>
						</View>
						<Muted className="self-start mb-5">
							to start building your Oasis
						</Muted>
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
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormInput
											label="Confirm Password"
											placeholder="Confirm password"
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
				</ScrollView>
			</KeyboardAvoidingView>

			<View className="gap-y-4 mt-2">
				<Button
					size="default"
					variant="default"
					onPress={form.handleSubmit(onSubmit)}
					loading={form.formState.isSubmitting}
					label="Sign Up"
				/>
				<Separator orientation="horizontal" />
				<Button
					variant="secondary"
					loading={loading}
					onPress={() => onSignInWithGoogle()}
					label="Sign Up with Google"
					icon={<FontAwesome6 name="google" size={12} color={iconColor} />}
					iconPosition="left"
				/>
				<AppleAuthButton />
				<Muted
					className="text-center"
					onPress={() => {
						router.replace("/sign-in");
					}}
				>
					Already have an account?{" "}
					<Muted className="text-foreground">Sign in</Muted>
				</Muted>
			</View>
		</SafeAreaView>
	);
}
