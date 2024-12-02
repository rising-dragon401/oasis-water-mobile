import { Feather } from "@expo/vector-icons";
import algoliasearch from "algoliasearch";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import ResultsRow from "./results-row";

import { Input } from "@/components/ui/input";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
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
	placeholder,
	overridePress,
	hideScan,
	showRequestItem = true,
}: {
	indices?: string[];
	setActive: (active: boolean) => void;
	placeholder?: string;
	overridePress?: (item: any) => void;
	hideScan?: boolean;
	showRequestItem?: boolean;
}) {
	const { hasActiveSub } = useSubscription();

	const [results, setResults] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [, setQueryCompleted] = useState(false);
	const [value, setValue] = useState("");
	const [noResults, setNoResults] = useState(false);
	const [showSearchIcon, setShowSearchIcon] = useState(true);

	const debouncedQuery = useDebounce(value, 400);
	const debouncedSearch = useDebounce(value, 1000); // prevent spamming the search event while user typing
	const { mutedForegroundColor, iconColor } = useColorScheme();
	const router = useRouter();
	const posthog = usePostHog();
	const showToast = useToast();
	const [permission, requestPermission] = Camera.useCameraPermissions();

	useEffect(() => {
		setQueryCompleted(false);
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery]);

	useEffect(() => {
		if (debouncedSearch) {
			captureSearchEvent();
		}
	}, [debouncedSearch]);

	const captureSearchEvent = () => {
		posthog?.capture("search", {
			query: debouncedSearch,
			has_results: results?.length > 0,
		});
	};

	const onChangeText = (text: string) => {
		setValue(text);
	};

	const handleClear = () => {
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
					indexName: "categories",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 5,
					},
				},
				{
					indexName: "items",
					query,
					params: {
						restrictSearchableAttributes: [
							"name",
							"brand_name",
							"company_name",
						],
						hitsPerPage: numResults || 10,
					},
				},
				{
					indexName: "brands",
					query,
					params: {
						// restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 3,
					},
				},
				{
					indexName: "stores",
					query,
					params: {
						// restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 3,
					},
				},
				{
					indexName: "water_filters",
					query,
					params: {
						restrictSearchableAttributes: ["name"],
						hitsPerPage: numResults || 10,
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
				// {
				// 	indexName: "users",
				// 	query,
				// 	params: {
				// 		restrictSearchableAttributes: ["name"],
				// 		hitsPerPage: numResults || 3,
				// 	},
				// },
			];
		}

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

	const handleScan = async () => {
		if (!hasActiveSub) {
			router.push("/subscribeModal");
			return;
		}

		if (permission?.granted) {
			router.push("/scanModal");
		} else if (!permission?.granted) {
			const permission_granted = await requestPermission();
			if (permission_granted?.granted) {
				router.push("/scanModal");
			} else {
				showToast("Please allow camera access to use the product scanner");
			}
		}
	};

	const inputRef = useRef<any>(null);

	useEffect(() => {
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery]);

	const handleFocus = () => {
		setShowSearchIcon(false);
		setActive(true);
	};

	const handleBlur = () => {
		setShowSearchIcon(true);
		setActive(false);
	};

	return (
		<>
			<View className="flex flex-row gap-2 items-center relative z-10">
				<Input
					ref={inputRef}
					placeholder={placeholder || "Water, filters, locations"}
					value={value}
					onChangeText={onChangeText}
					aria-labelledbyledBy="inputLabel"
					aria-errormessage="inputError"
					className="w-full pl-12 z-20 !h-16 !rounded-full transition-all duration-100"
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>

				{!value ? (
					<View
						className="flex flex-row gap-4 z-20 items-center"
						style={{ position: "absolute", left: 16 }}
					>
						<Feather name="search" size={20} color={iconColor} />
					</View>
				) : (
					<TouchableOpacity
						onPress={handleClear}
						className="flex flex-row gap-4 z-20 items-center"
						style={{ position: "absolute", left: 16 }}
					>
						<Feather name="arrow-left" size={18} color={mutedForegroundColor} />
					</TouchableOpacity>
				)}

				<View
					className="flex flex-row gap-4 z-20 items-center"
					style={{ position: "absolute", right: 10 }}
				>
					{/* {value && !isLoading && (
						<TouchableOpacity onPress={handleClear}>
							<Octicons name="x-circle-fill" size={20} color={iconColor} />
						</TouchableOpacity>
					)} */}

					{isLoading && (
						<ActivityIndicator
							size="small"
							color={mutedForegroundColor}
							className={value?.length > 0 ? "pr-4" : ""}
						/>
					)}

					{!hideScan && value?.length === 0 && (
						<TouchableOpacity onPress={handleScan} className="pr-4">
							<Feather name="camera" size={20} color={mutedForegroundColor} />
						</TouchableOpacity>
					)}
				</View>
			</View>
			{(results.length > 0 || (noResults && value.length > 0)) && (
				<ResultsRow
					results={results}
					noResults={noResults}
					overridePress={overridePress}
					setResults={setResults}
					showRequestItem={showRequestItem}
				/>
			)}
		</>
	);
}
