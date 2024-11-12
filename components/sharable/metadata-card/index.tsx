import { View } from "react-native";

import { P } from "@/components/ui/typography";

type Props = {
	title: string;
	description: string;
	className?: string;
};

export default function MetaDataCard({ title, description, className }: Props) {
	return (
		<View
			className={`flex flex-col justify-between gap-y-2 flex-1 bg-muted border border-border rounded-lg p-4 ${className}`}
		>
			<P className="text-muted-foreground flex-wrap">{description}</P>
			<P className="text-lg font-medium">{title}</P>
		</View>
	);
}
