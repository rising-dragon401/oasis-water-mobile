import cn from "classnames";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Octicons } from "@expo/vector-icons";
import { Button } from "components/ui/button";
import { useUserProvider } from "context/user-provider";

import BlurWrapper from "./blur-wrapper";

type PaywallContentProps = {
	children: React.ReactNode;
	className?: string;
	hideButton?: boolean;
	label: string;
};

const PaywallContent: React.FC<PaywallContentProps> = ({
	children,
	className,
	hideButton = false,
	label,
}) => {
	const router = useRouter();

	// const pathname = usePathname();
	const { subscription } = useUserProvider();

	const [open, setOpen] = useState(false);

	const handleBlurClick = () => {
		if (!subscription) {
			router.push("/subscribeModal");
			setOpen(true);
		}
	};

	if (subscription) {
		return <>{children}</>;
	}

	return (
		<TouchableOpacity
			className={cn("relative rounded-lg  hover:cursor-pointer", className)}
			onPress={handleBlurClick}
		>
			{!hideButton && (
				<View className="absolute inset-0 flex justify-center items-center">
					<Button
						className="w-14 rounded-full "
						variant="default"
						size="default"
						onPress={handleBlurClick}
					>
						<Text>
							<Octicons name="lock" size={16} color="white" />
						</Text>
					</Button>
				</View>
			)}
			<BlurWrapper>{children}</BlurWrapper>
		</TouchableOpacity>
	);
};

export default PaywallContent;
