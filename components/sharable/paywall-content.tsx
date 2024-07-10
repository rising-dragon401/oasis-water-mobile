import cn from "classnames";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Octicons } from "@expo/vector-icons";
import { Button } from "components/ui/button";
import { useUserProvider } from "context/user-provider";
import Typography from "./typography";
type PaywallContentProps = {
	children: React.ReactNode;
	className?: string;
	hideButton?: boolean;
	label: string;
	title?: string;
	items?: string[];
};

const PaywallContent: React.FC<PaywallContentProps> = ({
	children,
	className,
	hideButton = false,
	title,
	label,
	items,
}) => {
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.light.primary : theme.dark.primary;

	// const pathname = usePathname();
	const { subscription } = useUserProvider();

	const [open, setOpen] = useState(false);

	const handleUpgradeClick = () => {
		if (!subscription) {
			router.push("/subscribeModal");
			setOpen(true);
		}
	};

	if (subscription) {
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
				<View className="flex hover:cursor-pointer w-[90vw] bg-secondary p-4 py-6 rounded-md gap-x-4 items-center gap-y-4">
					{label && (
						<Typography
							size="2xl"
							fontWeight="normal"
							className="mb-2 text-center"
						>
							{label}
						</Typography>
					)}

					{items && (
						<View className="flex flex-col gap-4 text-center">
							{items.map((item, index) => (
								<Typography
									key={index}
									size="base"
									fontWeight="normal"
									className="text-primary text-center"
								>
									{item}
								</Typography>
							))}
						</View>
					)}

					<Button
						variant="default"
						label="Upgrade now"
						onPress={handleUpgradeClick}
						iconPosition="right"
						icon={<Octicons name="lock" size={16} color={iconColor} />}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default PaywallContent;
