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
import { FlatList, View } from "react-native";
import Typography from "./typography";

type Props = {
	contaminantId: number;
	align?: "start" | "end";
};

export function ContaminantFiltersDropdown({
	contaminantId,
	align = "end",
}: Props) {
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
		<DropdownMenu
			open={open}
			onOpenChange={(newVal) => {
				if (!newVal) {
					setOpen(false);
				}
				setOpen(newVal);
			}}
			className="relative"
		>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" label="Filters" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 z-50" align={align}>
				<DropdownMenuLabel>Filters</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filters.length > 0 ? (
						<FlatList
							data={filters}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<View>
									<DropdownMenuItem>
										<Link href={`/search/filter/${item.id}`}>
											<Typography size="base" fontWeight="normal">
												{item.name}
											</Typography>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</View>
							)}
							style={{ height: 200 }}
						/>
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
