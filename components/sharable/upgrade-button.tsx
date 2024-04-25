import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";

export default function UpgradeButton() {
	const { push } = useRouter();

	const handleUpgrade = () => {
		push("/subscribeModal");
	};
	return (
		<Button
			className="w-full"
			variant="default"
			label="Upgrade"
			onPress={handleUpgrade}
			icon={<Octicons name="plus" size={16} color="white" />}
		/>
	);
}
