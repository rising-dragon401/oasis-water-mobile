import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
	TouchableOpacity,
	View,
} from "react-native";

import {
	getAllFilterIdsAndNames,
	getAllItemIdsAndNames,
	searchForProduct,
} from "@/actions/admin";
import { uploadCameraImage } from "@/actions/files";
import { Large, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";

export default function ScanModal() {
	const navigation = useNavigation();
	const { uid } = useUserProvider();
	const showToast = useToast();

	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState(
		"Snap a pic of your water or filter",
	);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [cameraRef, setCameraRef] = useState<Camera | null>(null);
	const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
	const [productType, setProductType] = useState<string | null>(null);
	const [product, setProduct] = useState<any | null>(null);
	// Cached all items and filters (for image detection)
	const [items, setItems] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);

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

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const takePicture = async () => {
		if (cameraRef) {
			setLoading(true);
			const photo = await cameraRef.takePictureAsync();
			setPhoto(photo);
			sendToOpenAI(photo);
		}
	};

	const sendToOpenAI = async (photo: CameraCapturedPicture) => {
		if (!uid) {
			showToast("Please login to scan", 1000);
			setLoading(false);
			return;
		}

		setLoading(true);

		try {
			setLoadingText("Analyzing image...");

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
								text: "What's in this image? Only respond with the name of the product and type like this: {productName: 'name', type: 'type'}. Type is either water bottled or filter.",
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

			console.log("productIdentified: ", productIdentified);

			// Correctly parse the productIdentified string
			const productIdentifiedObject = productIdentified.match(
				/{\s*productName:\s*'([^']*)',\s*type:\s*'([^']*)'\s*}/,
			);

			if (!productIdentifiedObject) {
				throw new Error("Error parsing productIdentified");
			}

			const parsedProductIdentified = {
				name: productIdentifiedObject[1],
				type: productIdentifiedObject[2],
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
				setProduct(productDetails.data);
			} else {
				throw new Error("Could not identify product");
			}
		} catch (error) {
			// console.error("Error sending image to OpenAI:", error);
			showToast("Could not identify product", 1000);
		} finally {
			setLoading(false);
			setLoadingText("Snap a pic of your water or filter");
		}
	};

	const closeModal = () => {
		navigation.goBack();
	};

	if (hasPermission === null) {
		return <View />;
	}

	if (hasPermission === false) {
		return <Muted>No access to camera</Muted>;
	}

	return (
		<View style={{ flex: 1 }}>
			<Camera
				style={{ flex: 1 }}
				type={CameraType.back}
				ref={(ref) => setCameraRef(ref as Camera)}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<View className="flex-row justify-center items-center p-5 absolute top-0 left-0 right-0 z-10 bg-white/70 dark:bg-black/70">
						<TouchableOpacity
							style={{
								position: "absolute",
								left: 20,

								width: 30,
								height: 30,
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={closeModal}
						>
							<Ionicons name="close" size={30} color="white" />
						</TouchableOpacity>
						<Large className="text-white items-center">Scan item</Large>
					</View>

					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View
							style={{
								width: "80%",
								height: "60%",
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
									width: 30,
									height: 30,
									borderTopLeftRadius: 15,
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
									width: 30,
									height: 30,
									borderTopRightRadius: 15,
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
									width: 30,
									height: 30,
									borderBottomLeftRadius: 15,
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
									width: 30,
									height: 30,
									borderBottomRightRadius: 15,
								}}
							/>
						</View>
						{loading && (
							<ActivityIndicator size="small" color="#fff" className="mb-4" />
						)}

						<P className="text-white">{loadingText}</P>
					</View>

					{/* Product card */}
					{product && (
						<View className="flex flex-col items-center">
							<Link
								href={
									productType === "filter"
										? `/(protected)/search/filter/${product.id}`
										: `/(protected)/search/item/${product.id}`
								}
								className="flex flex-row items-center p-4 m-2  max-w-md border border-muted"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.2)",
									borderRadius: 10,
								}}
							>
								<View className="flex flex-row items-center p-2 px-4 rounded-lg">
									<View className="flex justify-center">
										<Image
											source={{ uri: product.image }}
											style={{
												width: 50,
												height: 50,
												borderRadius: 10,
												marginRight: 10,
											}}
											contentFit="cover"
											className="rounded-md w-14 h-14"
										/>
									</View>
									<View className="flex justify-center">
										<Large className="text-white text-wrap max-w-xs pr-8">
											{product.name}
										</Large>
										<P className="text-white">{product.brand.name}</P>
									</View>
								</View>
							</Link>
						</View>
					)}

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
							onPress={takePicture}
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
				</SafeAreaView>
			</Camera>
		</View>
	);
}
