import { Octicons } from "@expo/vector-icons";
import algoliasearch from "algoliasearch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

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
	const [isLoading, setIsLoading] = useState(false);
	const [, setQueryCompleted] = useState(false);
	const [value, setValue] = useState("");

	const debouncedQuery = useDebounce(value, 500);
	const router = useRouter();

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

	const handleClear = () => {
		console.log("clearing search");
		setValue("");
		setResults([]);
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
					className="!rounded-full w-full pl-4 z-40"
				/>

				<View
					className="flex flex-row gap-3 mr-4 z-50 items-center"
					style={{ position: "absolute", right: 10 }}
				>
					{isLoading && <ActivityIndicator size="small" color="black" />}

					<View>
						{!value ? (
							<TouchableOpacity
							// onPress={() => handleSearch(value)}
							>
								<Octicons name="search" size={18} color="black" />
							</TouchableOpacity>
						) : (
							<TouchableOpacity onPress={handleClear}>
								<Octicons name="x-circle-fill" size={18} color="black" />
							</TouchableOpacity>
						)}
					</View>

					{/* <TouchableOpacity
						// @ts-ignore
						onPress={() => router.push("/chatModal")}
					>
						<Ionicons name="sparkles-outline" size={20} color="black" />
					</TouchableOpacity> */}
				</View>
			</View>
			{results.length > 0 && <ResultsRow results={results} />}
		</>
	);
}
