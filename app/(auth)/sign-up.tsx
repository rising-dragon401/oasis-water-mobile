import React from "react";
import { Text, View } from "react-native";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "@/lib/tailwind";
import { useSupabase } from "@/context/useSupabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const FormSchema = z
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
	const { signUp } = useSupabase();
	const router = useRouter();

	const {
		control,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			await signUp(data.email, data.password);
			alert("Check your email for a 6-digit OTP.");
			router.push({
				pathname: "/verify",
				params: { email: data.email },
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<SafeAreaView
			style={tw`flex-1 items-center bg-background dark:bg-dark-background p-4`}
		>
			<View style={tw`w-full gap-y-4`}>
				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Email"
							placeholder="Email"
							value={value}
							onChangeText={onChange}
							onBlur={() => {
								trigger("email");
								onBlur();
							}}
							errors={errors.email?.message}
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect={false}
							keyboardType="email-address"
						/>
					)}
				/>
				<Controller
					control={control}
					name="password"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Password"
							placeholder="Password"
							value={value}
							onChangeText={onChange}
							onBlur={() => {
								trigger("password");
								onBlur();
							}}
							errors={errors.password?.message}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry
						/>
					)}
				/>
				<Controller
					control={control}
					name="confirmPassword"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Confirm password"
							placeholder="Confirm password"
							value={value}
							onChangeText={onChange}
							onBlur={() => {
								trigger("confirmPassword");
								onBlur();
							}}
							errors={errors.confirmPassword?.message}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry
						/>
					)}
				/>
			</View>
			<View style={tw`w-full gap-y-4 absolute bottom-[50px]`}>
				<Button
					label="Sign Up"
					onPress={handleSubmit(onSubmit)}
					isLoading={isSubmitting}
				/>
				<Text
					style={tw`muted text-center`}
					onPress={() => {
						router.push("/login");
					}}
				>
					Already have an account?
				</Text>
			</View>
		</SafeAreaView>
	);
}
