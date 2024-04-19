import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";

import Typography from "../typography";

type BlurredLineItemProps = {
	label: string;
	value: string;
	labelClassName?: string;
};

export default function BlurredLineItem({
	label,
	value,
	labelClassName,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { subscription } = useUserProvider();

	const handleOpenPaywall = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!subscription) {
			router.push("/modals/subscribe");
		}
	};

	const showPaywall = !subscription;

	return (
		<div>
			<Typography
				size="base"
				fontWeight="normal"
				className="text-secondary my-0"
			>
				<span className={labelClassName}>{label}:</span>{" "}
				<span
					onClick={showPaywall ? handleOpenPaywall : undefined}
					style={{
						// filter: showPaywall ? 'blur(4px)' : 'none',
						// cursor: showPaywall ? 'pointer' : 'default',
						minWidth: "3rem",
					}}
					className="min-w-14"
				>
					{value}
				</span>
			</Typography>
		</div>
	);
}
