import { Button } from "@/components/ui/button";
import { Octicons } from "@expo/vector-icons";
import cn from "classnames";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import { useUserProvider } from "context/user-provider";

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
	const { user, subscription, userData } = useUserProvider();

	const [open, setOpen] = useState(false);

	const handleBlurClick = () => {
		if (!subscription) {
			router.push("/modals/subscribe");
			setOpen(true);
		}
	};

	if (subscription) {
		return <>{children}</>;
	}

	return (
		<>
			{/* <SubscribeModal open={open} setOpen={setOpen} /> */}

			<div
				className={cn("relative rounded-lg  hover:cursor-pointer", className)}
				onClick={handleBlurClick}
			>
				{/* Overlay container */}
				{!hideButton && (
					<div className="absolute inset-0 flex justify-center items-center">
						<Button
							className="w-14 rounded-full "
							variant="default"
							size="default"
							onPress={handleBlurClick}
						>
							<Octicons name="lock" size={16} color="white" />
						</Button>
					</div>
				)}
				{/* Blurred children content */}
				<div className="filter blur-md overflow-hidden">{children}</div>
			</div>
		</>
	);
};

export default PaywallContent;
