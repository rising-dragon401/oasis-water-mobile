import { Octicons } from "@expo/vector-icons";
import algoliasearch from "algoliasearch";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import ResultsRow from "./results-row";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

const numResults = 5;

const searchClient = algoliasearch(
	process.env.EXPO_PUBLIC_ALGOIA_APP_ID!,
	process.env.EXPO_PUBLIC_ALGOIA_SEARCH_KEY!,
);

export default function Search({ indices }: { indices?: string[] }) {
	const [results, setResults] = useState<any[]>([]);
	const [, setIsLoading] = useState(false);
	const [, setQueryCompleted] = useState(false);
	const [value, setValue] = useState("");

	const debouncedQuery = useDebounce(value, 500);

	useEffect(() => {
		setQueryCompleted(false);
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery]);

	const onChangeText = (text: string) => {
		setValue(text);
	};

	const handleSearch = async (query: string) => {
		setIsLoading(true);

		let queries: any[] = [];
		if (indices && indices.length > 0) {
			queries = indices.map((index) => ({
				indexName: index,
				query,
				params: {
					hitsPerPage: numResults || 5,
				},
			}));
		} else {
			queries = [
				{
					indexName: "items",
					query,
					params: {
						hitsPerPage: numResults || 15,
					},
				},
				{
					indexName: "tap_water_locations",
					query,
					params: {
						hitsPerPage: numResults || 5,
					},
				},
				{
					indexName: "water_filters",
					query,
					params: {
						hitsPerPage: numResults || 3,
					},
				},
			];
		}

		try {
			const response = await searchClient.multipleQueries(queries);
			console.log("algolia results: ", response.results);
			const hits = response.results.map((result: any) => result.hits);
			console.log("algolia hits: ", hits);
			setResults(hits.flat());
		} catch (error) {
			console.error("Failed to fetch from Algolia", error);
			// Handle the error appropriately in the UI
		} finally {
			setIsLoading(false);
			setQueryCompleted(true);
		}
	};

	return (
		<>
			<View className="flex flex-row gap-2 items-center relative">
				<Input
					placeholder="Search water, filters, location..."
					value={value}
					onChangeText={onChangeText}
					aria-labelledbyledBy="inputLabel"
					aria-errormessage="inputError"
					className="!rounded-full w-full pl-4"
				/>

				<TouchableOpacity
					// onPress={() => handleSearch(value)}
					className="absolute right-6"
				>
					<Octicons name="search" size={18} color="black" />
				</TouchableOpacity>
			</View>
			{results.length > 0 && <ResultsRow results={results} />}
		</>
	);
}
