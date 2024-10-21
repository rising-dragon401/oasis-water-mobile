import { Feather, Octicons } from "@expo/vector-icons";
import algoliasearch from "algoliasearch";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import ResultsRow from "./results-row";

import { Input } from "@/components/ui/input";
import { theme } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useColorScheme } from "@/lib/useColorScheme";
const numResults = 5;

const searchClient = algoliasearch(
	process.env.EXPO_PUBLIC_ALGOIA_APP_ID!,
	process.env.EXPO_PUBLIC_ALGOIA_SEARCH_KEY!,
);

export default function Search({
	indices,
	setActive,
}: {
	indices?: string[];
	setActive: (active: boolean) => void;
}) {
	const [results, setResults] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [, setQueryCompleted] = useState(false);
	const [value, setValue] = useState("");

	const debouncedQuery = useDebounce(value, 200);
	const debouncedUnfocus = useDebounce(value, 500);
	const { colorScheme, mutedForegroundColor } = useColorScheme();
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
					restrictSearchableAttributes: ["name"],
					hitsPerPage: numResults || 5,
				},
			}));
		} else {
			queries = [
				{
					indexName: "items",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 15,
					},
				},
				{
					indexName: "tap_water_locations",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 5,
					},
				},
				{
					indexName: "water_filters",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 3,
					},
				},
				{
					indexName: "users",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 3,
					},
				},
			];
		}

		try {
			const response = await searchClient.multipleQueries(queries);
			const hits = response.results.map((result: any) => result.hits);

			setResults(hits.flat());
		} catch (error) {
			console.error("Failed to fetch from Algolia", error);
			// Handle the error appropriately in the UI
		} finally {
			setIsLoading(false);
			setQueryCompleted(true);
		}
	};

	const handleScan = () => {
		router.push("/scanModal");
	};

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	const inputRef = useRef<any>(null);

	// Function to blur (unfocus) the input
	const blurInput = () => {
		inputRef.current?.blur();
	};

	useEffect(() => {
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery]);

	useEffect(() => {
		// Blur the input when the debounced unfocus value changes
		blurInput();
	}, [debouncedUnfocus]);

	return (
		<>
			<View className="flex flex-row gap-2 items-center relative z-50">
				<Input
					ref={inputRef}
					placeholder="Search your water, filter or city"
					value={value}
					onChangeText={onChangeText}
					aria-labelledbyledBy="inputLabel"
					aria-errormessage="inputError"
					className="w-full pl-4 z-40 !h-16 !rounded-full"
					onFocus={() => setActive(true)}
					onBlur={() => setActive(false)}
				/>

				<View
					className="flex flex-row gap-4 z-50 items-center"
					style={{ position: "absolute", right: 10 }}
				>
					{value && (
						<TouchableOpacity onPress={handleClear}>
							<Octicons name="x-circle-fill" size={20} color={iconColor} />
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={handleScan} className="mr-4">
						<Feather name="camera" size={20} color={iconColor} />
					</TouchableOpacity>
					{isLoading && (
						<ActivityIndicator size="small" color={mutedForegroundColor} />
					)}
				</View>
			</View>
			{results.length > 0 && <ResultsRow results={results} />}
		</>
	);
}
