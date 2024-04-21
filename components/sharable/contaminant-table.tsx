import { useEffect, useMemo, useState } from "react";

import { Octicons } from "@expo/vector-icons";
import { getContaminants } from "actions/ingredients";
import { StyleSheet, Text, View } from "react-native";
import { ContaminantFiltersDropdown } from "./contaminant-filters-dropdown";

type Props = {
	filteredContaminants: any[];
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		padding: 10,
		backgroundColor: "#f3f3f3",
	},
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		padding: 10,
	},
	cell: {
		width: "100%",
		marginRight: 10,
		flex: 1, // Adjust flex values as needed to allocate space
	},
	text: {
		fontSize: 12,
	},
	icon: {
		width: 24,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default function ContaminantTable({ filteredContaminants }: Props) {
	const [contaminants, setContaminants] = useState<any[]>([]);

	useEffect(() => {
		getContaminants().then((data) => {
			setContaminants(data);
		});
	}, []);

	// Sort contaminants: filtered ones first
	const sortedContaminants = useMemo(
		() =>
			contaminants?.sort((a, b) => {
				const aIsFiltered = filteredContaminants?.some((fc) => fc.id === a.id)
					? 1
					: 0;
				const bIsFiltered = filteredContaminants?.some((fc) => fc.id === b.id)
					? 1
					: 0;
				return bIsFiltered - aIsFiltered;
			}),
		[contaminants, filteredContaminants],
	);

	return (
		<View className="w-[92vw]">
			<View style={styles.header}>
				<Text style={[styles.cell, styles.text]}>Name</Text>
				<Text style={[styles.cell, styles.text]}>Filtered?</Text>
				<Text style={[styles.cell, styles.text]}>Filtered By</Text>
			</View>
			{sortedContaminants?.map((contaminant, index) => (
				<View
					key={index}
					style={styles.row}
					className="flex justify-center items-center text-left w-full"
				>
					<Text style={[styles.cell, styles.text]}>{contaminant.name}</Text>
					<View style={[styles.cell, styles.icon]}>
						{filteredContaminants?.some((fc) => fc.id === contaminant.id) ? (
							<Octicons name="check" size={16} color="black" />
						) : (
							<Octicons name="x" size={16} color="black" />
						)}
					</View>
					<ContaminantFiltersDropdown
						contaminantId={contaminant?.id}
						align="end"
					/>
				</View>
			))}
		</View>
	);
}
