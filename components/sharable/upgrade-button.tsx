import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";

type UpgradeButtonProps = {
	label?: string;
};

export default function UpgradeButton({ label }: UpgradeButtonProps) {
	const { push } = useRouter();

	const handleUpgrade = () => {
		push("/subscribeModal");
	};
	return (
		<Button
			className="w-full"
			variant="default"
			label={label || "Upgrade"}
			onPress={handleUpgrade}
			icon={<Octicons name="plus" size={16} color="white" />}
		/>
	);
}
