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
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";

type Props = {
	sources: any[];
};

export function ArticlesDropdown({ sources }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Articles</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-96" align="end">
				<DropdownMenuLabel>Articles</DropdownMenuLabel>
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
								{source.label}
								<Octicons name="arrow-right" size={24} color="black" />
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
