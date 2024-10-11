import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorScheme } from "@/lib/useColorScheme";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import Typography from "../typography";

type Props = {
	sources: any[];
};

export function ArticlesDropdown({ sources }: Props) {
	const { iconColor } = useColorScheme();

	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" label="Research" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-96" align="start">
				<DropdownMenuLabel>Sources</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{sources.map((source: any) => (
						<DropdownMenuItem
							key={source.url}
							className="relative hover:opacity-70"
						>
							<Link
								href={source.url}
								className="flex items-center justify-between w-full pr-4"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Typography size="base" fontWeight="normal">
									{source.label}
								</Typography>
								<Octicons name="arrow-right" size={24} color={iconColor} />
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
