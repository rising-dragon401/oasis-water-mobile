import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

import {
	getAllFilterIdsAndNames,
	getAllItemIdsAndNames,
	searchForProduct,
} from "@/actions/admin";
import { uploadCameraImage } from "@/actions/files";
import OasisLogo from "@/assets/oasis-text.png";
import ScoreBadge from "@/components/sharable/score-badge";
import { Large, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { FILTER_CONTAMINANT_CATEGORIES } from "@/lib/constants/categories";
import { SCORES } from "@/lib/constants/health-effects";
import { useColorScheme } from "@/lib/useColorScheme";

// Add this interface before the component
interface MetadataValue {
	value: number | string | boolean;
	color: string;
	icon: string;
	show: boolean;
}

export default function ScanModal() {
	const navigation = useNavigation();
	const router = useRouter();
	const { uid } = useUserProvider();
	const showToast = useToast();
	const { iconColor, redColor, greenColor, neutralColor, backgroundColor } =
		useColorScheme();
	const [permission] = Camera.useCameraPermissions();

	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState(
		"Snap a pic of your water or filter",
	);
	const [cameraRef, setCameraRef] = useState<Camera | null>(null);
	const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

	const [productType, setProductType] = useState<string | null>(null);
	const [product, setProduct] = useState<any | null>({
		data: null,
		type: null,
		metadata: {
			totalContaminants: 0,
			contaminantsAboveLimit: 0,
			pfas: null,
			fluoride: null,
		},
	});
	// Cached all items and filters (for image detection)
	const [items, setItems] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);
	const [mode, setMode] = useState<"scan" | "preview">("scan");
	const [customAutoFocus, setCustomAutoFocus] = useState(false);
	const [scanGridHeight, setScanGridHeight] = useState(0);

	const animatedValue = useSharedValue(0);

	const loadingMessages = [
		"Checking for toxins...",
		"Searching latest research...",
		"Analyzing data...",
		"Compiling results...",
	];

	useEffect(() => {
		let messageIndex = 0;
		let interval: NodeJS.Timeout;

		if (loading) {
			interval = setInterval(() => {
				setLoadingText(loadingMessages[messageIndex]);
				messageIndex = (messageIndex + 1) % loadingMessages.length;
			}, 2000); // Change message every 2 seconds
		} else {
			setLoadingText("Snap a pic of your water or filter");
		}

		return () => clearInterval(interval);
	}, [loading]);

	useEffect(() => {
		if (loading) {
			animatedValue.value = withRepeat(
				withTiming(1, { duration: 2000 }),
				-1,
				true,
			);
		} else {
			animatedValue.value = 0;
		}
	}, [loading]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: animatedValue.value * scanGridHeight * 0.9,
				},
			],

			shadowColor: backgroundColor, // Ensure shadow color is set
			shadowOffset: { width: 2, height: 6 }, // Adjust shadow offset
			shadowOpacity: 0.5, // Increase shadow opacity
			shadowRadius: 6, // Increase shadow radius
			elevation: 10, // Increase elevation for Android
			borderRadius: 50,
		};
	});

	// Fetch all items and filters from local storage
	useEffect(() => {
		const fetchData = async () => {
			try {
				const cachedItems = await AsyncStorage.getItem("items");
				const cachedFilters = await AsyncStorage.getItem("filters");

				if (cachedItems && cachedFilters) {
					setItems(JSON.parse(cachedItems));
					setFilters(JSON.parse(cachedFilters));
				} else {
					const [itemData, filterData] = await Promise.all([
						getAllItemIdsAndNames(),
						getAllFilterIdsAndNames(),
					]);

					setItems(itemData);
					setFilters(filterData);

					AsyncStorage.setItem("items", JSON.stringify(itemData));
					AsyncStorage.setItem("filters", JSON.stringify(filterData));
				}
			} catch (error) {
				console.error("Error fetching items or filters:", error);
			}
		};

		fetchData();
	}, []);

	// Toggle auto focus
	useEffect(() => {
		const interval = setInterval(() => {
			if (customAutoFocus) {
				setCustomAutoFocus(false);
			} else {
				setCustomAutoFocus(true);
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	// Load saved state from AsyncStorage
	useEffect(() => {
		const loadSavedState = async () => {
			try {
				const savedPhoto = await AsyncStorage.getItem("savedPhoto");
				const savedProduct = await AsyncStorage.getItem("savedProduct");
				const savedProductType = await AsyncStorage.getItem("savedProductType");
				const savedMode = await AsyncStorage.getItem("savedMode");

				if (savedPhoto) setPhoto(JSON.parse(savedPhoto));
				if (savedProduct) setProduct(JSON.parse(savedProduct));
				if (savedProductType) setProductType(savedProductType);
				if (savedMode) setMode(savedMode as "scan" | "preview");
			} catch (error) {
				console.error("Error loading saved state:", error);
			}
		};

		loadSavedState();
	}, []);

	// Manage loading text and product state
	useEffect(() => {
		if (mode === "preview" && product) {
			setLoadingText("Product identified");
		} else if (mode === "scan" && !loading) {
			setLoadingText("Snap a pic of your water or filter");
		}

		if (!photo) {
			setMode("scan");
		}
	}, [product, mode, photo]);

	// Save state to AsyncStorage
	useEffect(() => {
		const saveState = async () => {
			try {
				await AsyncStorage.setItem("savedPhoto", JSON.stringify(photo));
				await AsyncStorage.setItem("savedProduct", JSON.stringify(product));
				await AsyncStorage.setItem("savedProductType", productType || "");
				await AsyncStorage.setItem("savedMode", mode);
			} catch (error) {
				console.error("Error saving state:", error);
			}
		};

		saveState();
	}, [photo, product, productType, mode]);

	const takePicture = async () => {
		if (!uid) {
			Alert.alert("Please login to scan", "", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						router.back();
						router.push("/(public)/sign-in");
					},
				},
			]);
			return;
		}

		if (cameraRef) {
			const photo = await cameraRef.takePictureAsync();
			setPhoto(photo);
			setProduct(null);
			setLoadingText("Analyzing image...");
			setLoading(true);
			setMode("scan");
			sendToOpenAI(photo);
		}
	};

	// Send image to OpenAI to identify product
	const sendToOpenAI = async (photo: CameraCapturedPicture) => {
		if (!uid) {
			showToast("Please login to scan", 1000);

			setLoading(false);
			setMode("scan");
			return;
		}

		setLoading(true);

		try {
			const imageData = await uploadCameraImage(
				photo.uri,
				"users",
				`${uid}/${Date.now()}_chat_image.jpg`,
			);

			if (!imageData) {
				throw new Error("Error uploading image");
			}

			const imageUrl = imageData?.publicUrl;

			const requestBody = {
				model: "gpt-4o",
				messages: [
					{
						role: "user",
						content: [
							{
								type: "text",
								text: "What's in this image? Only respond with the name of the product and type like this: {productName: 'name', type: 'type'}. Type is either bottled_water or filter. Some waters may be diferent sizes. So if its a 5 gallon bottle include gallon in the name.",
							},
							{
								type: "image_url",
								image_url: {
									url: imageUrl,
								},
							},
						],
					},
				],
				max_tokens: 300,
			};

			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/analyze-image`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				},
			).catch((error) => {
				console.error("Error sending image to OpenAI:", error);
				throw error;
			});

			const responseData = await response.json();

			const productIdentified = responseData.choices[0].message.content;

			// Correctly parse the productIdentified string
			const productIdentifiedObject = productIdentified.match(
				/{\s*productName:\s*'([^']*)',\s*type:\s*'([^']*)'\s*}/,
			);

			if (!productIdentifiedObject) {
				throw new Error("Error parsing productIdentified");
			}

			const type = productIdentifiedObject[2];

			const parsedProductIdentified = {
				name: productIdentifiedObject[1],
				type,
			};

			const type_ = parsedProductIdentified.type;
			if (type_ === "filter" || type_ === "bottle_filter") {
				setProductType("filter");
			} else {
				setProductType("item");
			}

			setLoadingText("Searching for product data...");

			// Search for the product in the database
			const productDetails = await searchForProduct(
				parsedProductIdentified,
				items,
				filters,
			);

			if (productDetails.success) {
				const metadata = await calculateProductMetadata(
					productDetails.data,
					type,
				);

				console.log("metadata: ", metadata);

				setProduct({
					data: productDetails.data,
					type: parsedProductIdentified.type,
					metadata,
				});

				console.log("set product data");

				setMode("preview");
				setLoadingText("Product identified ");
			} else {
				throw new Error("Could not identify product");
			}
		} catch (error) {
			// console.error("Error sending image to OpenAI:", error);
			setLoadingText("Snap a pic of your water or filter");
			Alert.alert(
				"Could not identify product",
				"Either the product is not in our database or the image is too blurry",
				[
					{
						text: "Try another image",
						onPress: () => {
							setLoading(false);
						},
					},
				],
			);
			// showToast("Could not identify product", 1000);
		} finally {
			setLoading(false);
		}
	};

	// Parse product medata for cards
	const calculateProductMetadata = useMemo(
		() => async (product: any, type: "bottled_water" | "filter") => {
			console.log("type", type);

			try {
				if (type === "bottled_water") {
					const contaminantsAboveLimit = product.contaminants.filter(
						(contaminant: any) => contaminant.exceedingLimit > 0,
					);

					const totalContaminants = product.contaminants.length;

					const hasPFAS = product.metadata?.pfas;

					const fluorideContaminant = product.contaminants?.find(
						(contaminant: any) => contaminant.name === "Fluoride",
					);
					const fluorideValue = fluorideContaminant
						? `${fluorideContaminant.amount} ppm`
						: "Not Detected";

					const hasFluoride = fluorideValue !== "Not Detected";

					const mineralCount = product.contaminants.filter(
						(contaminant: any) => contaminant.name === "Minerals",
					).length;

					const hasMicroplastics = product.packaging !== "glass";

					return {
						totalContaminants: {
							value: totalContaminants,
							color: totalContaminants > 0 ? redColor : greenColor,
							show: totalContaminants > 0,
						},
						contaminantsAboveLimit: {
							value: contaminantsAboveLimit.length,
							color:
								contaminantsAboveLimit.length > 0 ? redColor : neutralColor,
							show: contaminantsAboveLimit.length > 0,
						},
						pfas: {
							value:
								hasPFAS === "Yes"
									? "PFAS"
									: hasPFAS === "No"
										? "No PFAS"
										: "Unknown PFAS",
							color: hasPFAS === "Yes" ? redColor : greenColor,
							show: true,
						},
						minerals: {
							value: mineralCount,
							color: mineralCount > 0 ? greenColor : neutralColor,
							show: mineralCount > 0,
						},
						hasMicroplastics: {
							value: hasMicroplastics ? "Microplastics" : "Minimal plastics",
							color: hasMicroplastics ? redColor : greenColor,
							show: true,
						},
					};
				} else {
					const totalCategories = FILTER_CONTAMINANT_CATEGORIES.length;
					console.log("filter", JSON.stringify(product, null, 2));

					const filterCategories = product.filtered_contaminant_categories;

					// for each category in FILTER_CONTAMINANT_CATEGORIES check if it is in filterCategories and filters above 70 percent
					const filteredCategories = FILTER_CONTAMINANT_CATEGORIES.filter(
						(category) =>
							filterCategories.includes(category) &&
							product.filtered_contaminant_percentages[category] > 70,
					);

					const exposedCategories =
						FILTER_CONTAMINANT_CATEGORIES.length - filteredCategories.length;

					// Get the names of the categories not filtered
					const notFilteredCategories = FILTER_CONTAMINANT_CATEGORIES.filter(
						(category) => !filterCategories.includes(category),
					);

					const uniqueEffects = new Set();

					notFilteredCategories.forEach((category) => {
						SCORES.forEach((score) => {
							if (
								score.categoriesImpactedBy &&
								score.categoriesImpactedBy.includes(category)
							) {
								score.categoriesImpactedBy.forEach((effect) => {
									uniqueEffects.add(effect);
								});
							}
						});
					});

					const totalRiskCount = uniqueEffects.size;

					// Currently takes too long
					return {
						exposedCategories,
						notFilteredCategories,
						totalRisks: totalRiskCount,
					};
				}
			} catch (e) {
				console.log("Error calculating product metadata:", e);
				throw e;
			}
		},
		[],
	);

	const closeModal = () => {
		navigation.goBack();
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			// aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const selectedImage = result.assets[0];
			const cameraCapturedPicture: CameraCapturedPicture = {
				uri: selectedImage.uri,
				width: selectedImage.width,
				height: selectedImage.height,
				base64: selectedImage.base64 || undefined, // Ensure base64 is not null
			};
			setPhoto(cameraCapturedPicture);
			setProduct(null);
			setLoadingText("Analyzing image...");
			setLoading(true);
			setMode("scan");
			sendToOpenAI(cameraCapturedPicture);
		}
	};

	useEffect(() => {
		(async () => {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		})();
	}, []);

	const renderControls = () => {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View className="flex-row justify-center items-center p-5 absolute top-2 left-0 right-0 z-50">
					<TouchableOpacity
						style={{
							position: "absolute",
							left: 20,
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={closeModal}
						className="bg-white/20 rounded-full p-2"
					>
						<Ionicons name="close" size={24} color="white" />
					</TouchableOpacity>
					<View className="flex items-start justify-start  h-5 w-24">
						<Image
							source={OasisLogo}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
					{/* <Large className="text-white items-center">Scan item</Large> */}
				</View>
				{/* Scan grid */}
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						marginTop: 50,
					}}
				>
					{(mode === "scan" || loading) && (
						<View
							style={{
								width: "70%",
								height: "70%",
								position: "relative",
								overflow: "hidden",
								borderRadius: 30,
							}}
							onLayout={(event) => {
								const { height } = event.nativeEvent.layout;
								setScanGridHeight(height);
							}}
						>
							<View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									borderTopWidth: 3,
									borderLeftWidth: 3,
									borderColor: "white",
									width: 60,
									height: 60,
									borderTopLeftRadius: 30,
								}}
							/>
							<View
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									borderTopWidth: 3,
									borderRightWidth: 3,
									borderColor: "white",
									width: 60,
									height: 60,
									borderTopRightRadius: 30,
								}}
							/>
							<View
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									borderBottomWidth: 3,
									borderLeftWidth: 3,
									borderColor: "white",
									width: 60,
									height: 60,
									borderBottomLeftRadius: 30,
								}}
							/>
							<View
								style={{
									position: "absolute",
									bottom: 0,
									right: 0,
									borderBottomWidth: 3,
									borderRightWidth: 3,
									borderColor: "white",
									width: 60,
									height: 60,
									borderBottomRightRadius: 30,
								}}
							/>

							{loading && (
								<Animated.View
									style={[animatedStyle]}
									className=" flex flex-col gap-y-1 w-full justify-center"
								>
									<P className="mt-4 text-sm font-medium text-background z-50 flex text-center">
										{loadingText}
									</P>
									<View
										style={{
											bottom: 0,
											left: 0,
											right: 0,
											height: 4,
											backgroundColor,
											// opacity: 0.8,
											// shadowColor: "blue", // Blue shadow for glow effect
											// shadowOffset: { width: 0, height: 0 },
											// shadowOpacity: 0.8,
											// shadowRadius: 20, // Increase shadow radius for a stronger glow
										}}
									/>
								</Animated.View>
							)}
						</View>
					)}

					{/* {loading && (
						<ActivityIndicator size="small" color="#fff" className="mb-4" />
					)} */}
				</View>
				{/* Product card */}
				{product && product.data && mode === "preview" && resultCard()}
				{/* Scan button */}
				{!loading ? (
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 20,
						}}
						className="z-50"
					>
						<TouchableOpacity
							style={{
								width: mode === "scan" ? 80 : 50,
								height: mode === "scan" ? 80 : 50,
								backgroundColor: mode === "scan" ? "white" : "#d3d6d1",
								borderRadius: mode === "scan" ? 40 : 30,
								borderWidth: 4,
								marginTop: mode === "scan" ? 0 : 20,
								borderColor: "#ddd",
								justifyContent: "center",
								alignItems: "center",
								shadowColor: "#000",
								opacity: mode === "scan" ? 1 : 0.5,
								shadowOffset: { width: 0, height: 3 },
								shadowOpacity: 0.3,
								shadowRadius: 3,
								position: "relative",
							}}
							className="z-50 bg-card rounded-2xl border-2 border-border"
							disabled={loading}
							onPress={mode === "scan" ? takePicture : () => setMode("scan")}
						>
							{mode === "scan" ? (
								<View
									style={{
										width: 60,
										height: 60,
										backgroundColor: "white",
										borderRadius: 30,
									}}
								/>
							) : (
								<Ionicons name="refresh" size={20} color={iconColor} />
							)}
						</TouchableOpacity>
					</View>
				) : (
					<View style={{ height: 100 }} />
				)}
				{/* Upload existing image button */}
				{mode === "scan" && !loading && (
					<TouchableOpacity
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 20, // Adjust as needed
						}}
						onPress={pickImage}
					>
						<P className="underline text-background">Upload existing image</P>
					</TouchableOpacity>
				)}
				{/* Upload existing image button */}
				{mode === "preview" && !loading && (
					<TouchableOpacity
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginBottom: 20, // Adjust as needed
						}}
						onPress={closeModal}
					>
						<P className="underline text-background">
							Not the right item? Try search
						</P>
					</TouchableOpacity>
				)}
			</SafeAreaView>
		);
	};

	const ScoreTag = ({
		text,
		color = neutralColor,
	}: {
		text: any;
		color?: string;
	}) => {
		return (
			<View
				className="flex-row items-center justify-center gap-2 px-2 py-1"
				style={{
					borderColor: color,
					borderWidth: 1,
					borderRadius: 10,
				}}
			>
				<P
					className="text-sm font-medium"
					style={{
						color,
					}}
				>
					{text}
				</P>
			</View>
		);
	};

	const handleProductPress = () => {
		router.back();
		router.push(
			productType === "filter"
				? `/(protected)/search/filter/${product.data.id}`
				: `/(protected)/search/item/${product.data.id}`,
		);
	};

	const resultCard = () => {
		return (
			<TouchableOpacity
				onPress={handleProductPress}
				className="bg-card border border-border rounded-2xl pr-4 pl-4 py-4 shadow-md relative flex flex-row mx-4"
			>
				<View className="flex flex-row items-center justify-between w-full">
					<View className="w-20 h-20 overflow-hidden rounded-md">
						<Image
							source={{
								uri: product?.data?.image || "https://via.placeholder.com/52",
							}}
							style={{
								width: "100%",
								height: "100%",
							}}
							contentFit="cover"
							className="w-full h-full"
						/>
					</View>
					<View className="flex-1 flex-col ml-4 w-full">
						<P
							className="text-xl font-bold text-wrap w-44 leading-tight"
							numberOfLines={2}
						>
							{product?.data?.name || "Unknown Product"}
						</P>
						<View className="flex flex-row flex-wrap gap-2 mt-4">
							{productType === "filter" && (
								<>
									{product?.metadata?.totalRisks > 0 && (
										<ScoreTag
											key={product?.metadata?.totalRisks}
											text={`${product?.metadata?.totalRisks} potential health risks`}
											color={redColor}
										/>
									)}
									{product?.metadata?.exposedCategories > 0 && (
										<ScoreTag
											key={product?.metadata?.exposedCategories}
											text={`Exposed to ${product?.metadata?.exposedCategories} severe pollutants`}
											color={redColor}
										/>
									)}
								</>
							)}

							{productType === "item" && (
								<>
									{Object.entries(
										(product?.metadata as Record<string, MetadataValue>) || {},
									).map(([key, value]) => {
										if (value.show) {
											let text;
											let color;
											switch (key) {
												case "totalContaminants":
													text = `${value.value} total contaminants`;
													color = value.color;
													break;
												case "contaminantsAboveLimit":
													text = `${value.value} above limit`;
													color = value.color;
													break;
												case "pfas":
													text = value.value;
													color = value.color;
													break;
												case "minerals":
													text = `${value.value} minerals`;
													color = value.color;
													break;
												case "hasMicroplastics":
													text = value.value;
													color = value.color;
													break;
												default:
													return null;
											}
											return <ScoreTag key={key} text={text} color={color} />;
										}
										return null;
									})}
								</>
							)}
						</View>
					</View>
				</View>

				<View className="absolute top-2 right-2">
					<ScoreBadge score={product?.data?.score} />
				</View>
				{/* Add arrow icon in the bottom right */}
				<View className="absolute bottom-4 right-4">
					<Feather name="arrow-right" size={24} color={iconColor} />
				</View>
			</TouchableOpacity>
		);
	};

	if (!permission?.granted) {
		return (
			<View style={{ flex: 1 }}>
				<Feather name="camera-off" size={24} color={iconColor} />
				<Large>Unable to access camera</Large>
				<Muted>
					Please turn on Camera permissions for Oasis in your phone Privacy
					settings to start scanning waters and filters.
				</Muted>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			{mode === "scan" ? (
				<Camera
					style={{ flex: 1 }}
					type={CameraType.back}
					ref={(ref) => setCameraRef(ref as Camera)}
					autoFocus={customAutoFocus}
				>
					{loading && photo?.uri && (
						<Image
							source={{ uri: photo.uri }}
							style={{ position: "absolute", width: "100%", height: "100%" }}
						/>
					)}
					{renderControls()}
				</Camera>
			) : (
				<View style={{ flex: 1 }}>
					{photo && (
						<Image
							source={{ uri: photo.uri }}
							style={{ position: "absolute", width: "100%", height: "100%" }}
						/>
					)}

					{renderControls()}
				</View>
			)}
		</View>
	);
}
