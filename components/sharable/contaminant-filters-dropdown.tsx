import { Button } from "@/components/ui/button";
import { getFiltersByContaminant } from "actions/filters";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import Typography from "./typography";

type Props = {
	contaminantId: number;
	align?: "start" | "end";
};

export function ContaminantFiltersDropdown({ contaminantId, align }: Props) {
	const [filters, setFilters] = useState<any[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchFilters = async () => {
			const result = await getFiltersByContaminant(contaminantId);
			setFilters(result);
		};

		fetchFilters();
	}, [contaminantId]);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen} className="relative">
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Filters that remove this</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72" align={align}>
				<DropdownMenuLabel>Filters</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filters.length > 0 ? (
						filters.map((filter: any) => (
							<div key={filter.id}>
								<DropdownMenuItem key={filter.id}>
									<Link href={`/search/filter/${filter.id}`}>
										{filter.name}
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</div>
						))
					) : (
						<DropdownMenuItem>
							<Typography
								size="base"
								fontWeight="normal"
								className="text-secondary mt-2"
							>
								None
							</Typography>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
