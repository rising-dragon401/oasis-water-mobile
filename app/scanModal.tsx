import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { Image } from "expo-image";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	TouchableOpacity,
	View,
} from "react-native";
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
import Score from "@/components/sharable/score";
import { Large, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScanModal() {
	const navigation = useNavigation();
	const router = useRouter();
	const { uid } = useUserProvider();
	const showToast = useToast();
	const { textSecondaryColor, borderColor, foregroundColor } = useColorScheme();
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState(
		"Snap a pic of your water or filter",
	);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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
					translateY: animatedValue.value * scanGridHeight,
				},
			],

			shadowColor: "white", // Ensure shadow color is set
			shadowOffset: { width: 2, height: 6 }, // Adjust shadow offset
			shadowOpacity: 0.8, // Increase shadow opacity
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

	// Request camera permissions
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
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

	useEffect(() => {
		if (mode === "preview" && product) {
			setLoadingText("Product identified");
		} else if (mode === "scan" && !loading) {
			setLoadingText("Snap a pic of your water or filter");
		}
	}, [product, mode]);

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
			setLoadingText("Analyzing image...");
			setLoading(true);
			const photo = await cameraRef.takePictureAsync();
			setPhoto(photo);
			setProduct(null);
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
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				},
			);

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

			setProductType(parsedProductIdentified.type);

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

				setProduct({
					data: productDetails.data,
					type: parsedProductIdentified.type,
					metadata,
				});

				setMode("preview");
				setLoadingText("Product identified ");
			} else {
				throw new Error("Could not identify product");
			}
		} catch (error) {
			// console.error("Error sending image to OpenAI:", error);
			setLoadingText("Snap a pic of your water or filter");
			Alert.alert("Could not identify product", "", [
				{
					text: "Try again",
				},
			]);
			showToast("Could not identify product", 1000);
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

					const hasPFAS = product.metadata?.pfas === "Yes";

					const fluorideContaminant = product.contaminants?.find(
						(contaminant: any) => contaminant.name === "Fluoride",
					);
					const fluorideValue = fluorideContaminant
						? `${fluorideContaminant.amount} ppm`
						: "Not Detected";

					const hasFluoride = fluorideValue !== "Not Detected";

					return {
						totalContaminants: product.contaminants.length,
						contaminantsAboveLimit: contaminantsAboveLimit.length,
						pfas: hasPFAS,
						fluoride: hasFluoride,
					};
				} else {
					//  TOOD calculate filter metadata
					// Currently takes too long
					return null;
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

	const resetState = async () => {
		setPhoto(null);
		setProduct(null);
		setProductType(null);
		setMode("scan");
		try {
			await AsyncStorage.removeItem("savedPhoto");
			await AsyncStorage.removeItem("savedProduct");
			await AsyncStorage.removeItem("savedProductType");
			await AsyncStorage.removeItem("savedMode");
		} catch (error) {
			console.error("Error resetting state:", error);
		}
	};

	if (hasPermission === null) {
		return <View />;
	}

	if (hasPermission === false) {
		return <Muted>No access to camera</Muted>;
	}

	const renderControls = () => {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View className="flex-row justify-center items-center p-5 absolute top-2 left-0 right-0 z-10">
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
					<Large className="text-white items-center">Scan item</Large>
				</View>

				{/* Scan grid */}
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						marginTop: 50, // Adjust this value as needed
					}}
				>
					{(mode === "scan" || loading) && (
						<View
							style={{
								width: "80%",
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
									style={[
										{
											position: "absolute",
											left: 0,
											right: 0,
											height: 2,
											backgroundColor: "white",
											opacity: 0.8,
											transform: [{ scaleY: 1.2 }],
										},
										animatedStyle,
									]}
								/>
							)}
						</View>
					)}

					{loading && (
						<ActivityIndicator size="small" color="#fff" className="mb-4" />
					)}

					{mode === "scan" && (
						<P className="text-white mt-2 text-lg">{loadingText}</P>
					)}
				</View>

				{/* Product card */}
				{product && product.data && mode === "preview" && (
					<View className="flex flex-col items-center w-full px-6 mb-4">
						{mode === "preview" && (
							<P className="text-white mb-2 text-lg">{loadingText}</P>
						)}
						<Link
							href={
								productType === "filter"
									? `/(protected)/search/filter/${product.data.id}`
									: `/(protected)/search/item/${product.data.id}`
							}
						>
							<View
								style={{
									flexDirection: "column",
									padding: 16,
									paddingHorizontal: 16,
									borderRadius: 15,
									width: "100%",
									backgroundColor: "rgba(255, 255, 255, 0.7)",
									borderColor,
									borderWidth: 1,
									shadowColor: foregroundColor,
									shadowOffset: { width: 2, height: 4 },
									shadowOpacity: 0.2,
									shadowRadius: 6,
									elevation: 5,
									position: "relative",
								}}
								className="max-h-[240px] overflow-hidden"
							>
								<View className="flex w-full flex-row items-center mb-2">
									<Image
										source={{ uri: product.data.image }}
										style={{
											width: 72,
											height: 72,
											borderRadius: 10,
											marginRight: 10,
										}}
										contentFit="cover"
										className="rounded-md"
										transition={1000}
									/>
									<View className="flex-1 flex-col">
										<P className="!text-stone-500 text-sm">
											{productType === "bottled_water"
												? product.data.company?.name
												: product.data.company}
										</P>
										<P className="text-wrap pr-8 !text-stone-900 text-lg font-semibold leading-tight">
											{product.data.name.length > 36
												? `${product.data.name.substring(0, 33)}...`
												: product.data.name}
										</P>
									</View>
									<View className="flex-row items-center h-8">
										<Score score={product.data.score} size="xs" />
									</View>
								</View>

								{/* Tags */}
								<View className="flex ">
									{productType === "bottled_water" && product.metadata && (
										<View className="flex flex-row flex-wrap items-start justify-start gap-1 mb-2 w-full pr-10">
											{product.metadata.totalContaminants > 0 && (
												<View className="h-8 rounded-full px-3 items-center justify-center bg-red-200 px">
													<P>
														{product.metadata.totalContaminants} contaminants
													</P>
												</View>
											)}

											{product.metadata.contaminantsAboveLimit > 0 && (
												<View className="h-8 rounded-full px-2 items-center justify-center bg-red-200">
													<P>
														{product.metadata.contaminantsAboveLimit} above
														guidelines
													</P>
												</View>
											)}

											{product.metadata.pfas === true && (
												<View className="h-8 rounded-full px-2 items-center justify-center bg-red-200">
													<P>PFAS</P>
												</View>
											)}

											{product.metadata.fluoride === true && (
												<View className="h-8 rounded-full px-2 items-center justify-center bg-red-200">
													<P>Fluoride</P>
												</View>
											)}
										</View>
									)}

									{/* {productType === "filter" && product.metadata && (
										<View>
											{Object.keys(product.metadata.filterMetadata).map(
												(key) => {
													return (
														<View
															key={key}
															className="h-8 rounded-full px-2 items-center justify-center bg-red-200"
														>
															<P>{key}</P>
														</View>
													);
												},
											)}
										</View>
									)} */}
								</View>

								{/* Absolutely position the arrow icon */}
								<View style={{ position: "absolute", bottom: 16, right: 16 }}>
									<Feather
										name="arrow-right"
										size={24}
										color={textSecondaryColor}
									/>
								</View>
							</View>
						</Link>
					</View>
				)}

				{/* Scan button */}
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						marginBottom: 30,
					}}
				>
					<TouchableOpacity
						style={{
							width: 80,
							height: 80,
							backgroundColor: "white",
							borderRadius: 40,
							borderWidth: 4,
							borderColor: "#ddd",
							justifyContent: "center",
							alignItems: "center",
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 3 },
							shadowOpacity: 0.3,
							shadowRadius: 3,
							position: "relative",
						}}
						disabled={loading}
						onPress={mode === "scan" ? takePicture : () => setMode("scan")}
					>
						<View
							style={{
								width: 60,
								height: 60,
								backgroundColor: "white",
								borderRadius: 30,
							}}
						/>
					</TouchableOpacity>
				</View>

				{mode === "preview" && (
					<TouchableOpacity
						style={{
							position: "absolute",
							right: 20,
							top: 20,
							justifyContent: "center",
							alignItems: "center",
							zIndex: 10,
						}}
						onPress={resetState}
						className="bg-white/20 rounded-full p-2"
					>
						<Ionicons name="refresh" size={24} color="white" />
					</TouchableOpacity>
				)}
			</SafeAreaView>
		);
	};

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
