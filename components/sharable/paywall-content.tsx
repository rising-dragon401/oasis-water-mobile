import { Octicons } from "@expo/vector-icons";
import cn from "classnames";
import { Button } from "components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import Typography from "./typography";

import { useSubscription } from "@/context/subscription-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

type PaywallContentProps = {
	children: React.ReactNode;
	className?: string;
	hideButton?: boolean;
	label: string;
	title?: string;
	items?: string[];
	buttonLabel?: string;
};

const PaywallContent: React.FC<PaywallContentProps> = ({
	children,
	className,
	hideButton = false,
	title,
	label,
	items,
	buttonLabel,
}) => {
	const router = useRouter();
	const { colorScheme, accentColor } = useColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.light.primary : theme.dark.primary;

	const { hasActiveSub } = useSubscription();

	const handleUpgradeClick = () => {
		if (!hasActiveSub) {
			router.push("/subscribeModal");
		}
	};

	if (hasActiveSub) {
		return <>{children}</>;
	}

	return (
		<View className={cn("flex flex-col items-start justify-start", className)}>
			{title && (
				<Typography size="xl" fontWeight="bold" className="mb-2">
					{title}
				</Typography>
			)}
			<TouchableOpacity onPress={handleUpgradeClick}>
				<View className="flex hover:cursor-pointer w-[90vw] bg-muted p-4 py-6 rounded-lg gap-x-4 items-center gap-y-4">
					{label && (
						<Typography
							size="2xl"
							fontWeight="normal"
							className="mb-2 text-center"
						>
							{label}
						</Typography>
					)}

					{items && items.length > 0 && (
						<View className="flex flex-col gap-4 text-center justify-center">
							{items.map((item, index) => (
								<View
									key={index}
									className="flex flex-row items-center gap-2 w-96 justify-center"
								>
									<Octicons name="check" size={20} color={accentColor} />
									<Typography
										key={index}
										size="base"
										fontWeight="normal"
										className="text-primary text-center"
									>
										{item}
									</Typography>
								</View>
							))}
						</View>
					)}

					<Button
						variant="default"
						label={buttonLabel || "Upgrade now"}
						onPress={handleUpgradeClick}
						iconPosition="right"
						icon={<Octicons name="lock" size={16} color={iconColor} />}
						className="mt-4 w-72"
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default PaywallContent;
