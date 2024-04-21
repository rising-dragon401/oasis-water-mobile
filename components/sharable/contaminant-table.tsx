"use client";

import { Octicons } from "@expo/vector-icons";
import { getContaminants } from "actions/ingredients";
import { useEffect, useState } from "react";
import { ContaminantFiltersDropdown } from "./contaminant-filters-dropdown";

type Props = {
	filteredContaminants: any[];
};

export default function ContaminantTable({ filteredContaminants }: Props) {
	const [contaminants, setContaminants] = useState<any[]>([]);

	useEffect(() => {
		getContaminants().then((data) => {
			setContaminants(data);
		});
	}, []);

	// Sort contaminants: filtered ones first
	const sortedContaminants = contaminants?.sort((a, b) => {
		const aIsFiltered = filteredContaminants.some((fc) => fc.id === a.id)
			? 1
			: 0;
		const bIsFiltered = filteredContaminants.some((fc) => fc.id === b.id)
			? 1
			: 0;
		return bIsFiltered - aIsFiltered;
	});

	return (
		<table className="min-w-full divide-y divide-gray-200 overflow-scroll">
			<thead className="bg-gray-50">
				<tr>
					<th
						scope="col"
						className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-32"
					>
						Name
					</th>
					<th
						scope="col"
						className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-18"
					>
						Filtered?
					</th>

					<th
						scope="col"
						className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						Filtered By
					</th>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{sortedContaminants?.map((contaminant, index) => (
					<tr key={index}>
						<td className="px-2 py-4  md:text-sm text-xs font-medium text-gray-900 max-w-36 text-wrap">
							{contaminant.name}
						</td>
						<td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-14">
							{filteredContaminants.some((fc) => fc.id === contaminant.id) ? (
								<Octicons name="check" size={24} color="black" />
							) : (
								<Octicons name="x" size={24} color="black" />
							)}
						</td>

						<td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-24">
							<ContaminantFiltersDropdown
								contaminantId={contaminant?.id}
								align="end"
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
