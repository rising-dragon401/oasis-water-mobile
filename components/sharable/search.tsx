import { Feather, Octicons } from "@expo/vector-icons";
import algoliasearch from "algoliasearch";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import ResultsRow from "./results-row";

import { Input } from "@/components/ui/input";
import { theme } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useColorScheme } from "@/lib/useColorScheme";

const numResults = 10;

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
	const [noResults, setNoResults] = useState(false);

	const debouncedQuery = useDebounce(value, 400);
	const { colorScheme, mutedForegroundColor } = useColorScheme();
	const router = useRouter();
	const posthog = usePostHog();
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
		setNoResults(false);
		setIsLoading(true);

		let queries: any[] = [];
		if (indices && indices.length > 0) {
			queries = indices.map((index) => ({
				indexName: index,
				query,
				params: {
					restrictSearchableAttributes: ["name"],
					hitsPerPage: numResults || 15,
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
						restrictSearchableAttributes: ["name", "state", "zip_codes"],
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

		posthog?.capture("search", {
			query,
		});

		try {
			const response = await searchClient.multipleQueries(queries);
			const hits = response.results.map((result: any) => result.hits);

			setResults(hits.flat());
			setNoResults(hits.flat().length === 0);
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

	useEffect(() => {
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery]);

	return (
		<>
			<View className="flex flex-row gap-2 items-center relative z-10">
				<Input
					ref={inputRef}
					placeholder="Search your water, filter or location"
					value={value}
					onChangeText={onChangeText}
					aria-labelledbyledBy="inputLabel"
					aria-errormessage="inputError"
					className="w-full pl-6 z-20 !h-16 !rounded-full"
					onFocus={() => setActive(true)}
					onBlur={() => setActive(false)}
				/>

				<View
					className="flex flex-row gap-4 z-20 items-center"
					style={{ position: "absolute", right: 10 }}
				>
					{value && !isLoading && (
						<TouchableOpacity onPress={handleClear}>
							<Octicons name="x-circle-fill" size={20} color={iconColor} />
						</TouchableOpacity>
					)}

					{isLoading && (
						<ActivityIndicator size="small" color={mutedForegroundColor} />
					)}

					<TouchableOpacity onPress={handleScan} className="mr-4">
						<Feather name="camera" size={20} color={iconColor} />
					</TouchableOpacity>
				</View>
			</View>
			{(results.length > 0 || (noResults && value.length > 0)) && (
				<ResultsRow results={results} noResults={noResults} />
			)}
		</>
	);
}
