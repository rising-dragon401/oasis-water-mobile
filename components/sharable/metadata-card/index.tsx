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
			className={`flex flex-col justify-between gap-y-1 border border-muted rounded-lg p-4 ${className}`}
		>
			<P className="text-muted-foreground flex-wrap">{description}</P>
			<P className="text-lg">{title}</P>
		</View>
	);
}
