import { View } from "react-native";

import { Large, Muted } from "@/components/ui/typography";

// Define the Subtitle component
function Subtitle({ text }: { text: string }) {
	return <Muted className="mt-0">{text}</Muted>;
}

export default function SectionHeader({
	title,
	subtitle,
	iconButton,
}: {
	title: string;
	subtitle?: string;
	iconButton?: React.ReactNode;
}) {
	return (
		<View className="flex flex-col items-start mb-2">
			<View className="flex flex-row items-center justify-between w-full">
				<Large className="">{title}</Large>
				{iconButton}
			</View>
			{subtitle && <Muted className="mt-0">{subtitle}</Muted>}
		</View>
	);
}
