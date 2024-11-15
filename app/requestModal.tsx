import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

import { submitRequest } from "@/actions/labs";
import { FileUpload } from "@/components/sharable/file-upload";
import ItemSelector from "@/components/sharable/item-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function RequestModal() {
	const { uid } = useUserProvider();
	const { mutedForegroundColor } = useColorScheme();
	const showToast = useToast();
	const router = useRouter();

	const [tabValue, setTabValue] = useState("existing");
	const [selectedItems, setSelectedItems] = useState<any[]>([]);
	const [message, setMessage] = useState("");
	const [productName, setProductName] = useState("");
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

	async function handleSubmit() {
		const thisName =
			tabValue === "existing" ? selectedItems[0]?.name : productName;

		let type = tabValue === "existing" ? selectedItems[0]?.type : null;
		if (type === "item") {
			type = "bottled_water";
		}

		if (!message || !thisName) {
			showToast("Please fill out all fields", 2000, "bottom");
			return;
		}

		if (!uid) {
			showToast("Please login to submit", 2000, "bottom");
			return;
		}

		setLoadingSubmit(true);

		const success = await submitRequest({
			name: thisName,
			productId: selectedItems[0]?.id || null,
			productType: type || null,
			userId: uid,
			message,
			attachment: fileUrl || null,
			kind:
				tabValue === "existing"
					? "update_existing_product"
					: "request_new_product",
		});

		setLoadingSubmit(false);

		if (success) {
			showToast("Submitted. Thanks!", 2000);
			router.back();
		} else {
			showToast("Something went wrong. Please try again.", 2000);
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View className="pt-8 px-8 flex-1 pb-16 justify-between">
					<View className="flex flex-col">
						<View className="flex flex-col justify-between items-center text-center">
							<Feather name="globe" size={36} color="black" className="mb-4" />

							<P className="text-center max-w-sm">
								Help us source the most accurate information possible by sharing
								new data or suggesting updates
							</P>
						</View>

						<Tabs value={tabValue} onValueChange={setTabValue} className="mt-6">
							<TabsList className="flex flex-row justify-center mb-2">
								<TabsTrigger value="existing">
									<P
										className={`${
											tabValue === "existing"
												? "!text-secondary-foreground !font-semibold"
												: "text-primary"
										}`}
									>
										Existing item
									</P>
								</TabsTrigger>
								<TabsTrigger value="new_item">
									<P
										className={`${
											tabValue === "new_item"
												? "!text-secondary-foreground !font-semibold"
												: "text-primary"
										}`}
									>
										New item
									</P>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="existing" className="">
								<View className="flex flex-col w-full space-y-4 z-50">
									<Label nativeID="item" className="text-sm">
										Which item?
									</Label>
									<View className="flex flex-row w-full gap-2">
										{!selectedItems.length ? (
											<View className="w-full flex-1" style={{ zIndex: 999 }}>
												<ItemSelector
													items={selectedItems}
													setItems={setSelectedItems}
													initialItems={[]}
												/>
											</View>
										) : (
											<View className="flex flex-row items-center gap-2 bg-card p-2 rounded-xl border border-border w-full py-2 px-4 justify-between">
												<View className="flex flex-row items-center gap-2">
													<Image
														source={{ uri: selectedItems[0].image }}
														style={{ width: 36, height: 36 }}
														className="rounded-lg"
													/>
													<View className="flex flex-col gap-0  flex-wrap">
														<P
															className="max-w-64 font-medium"
															numberOfLines={1}
														>
															{selectedItems[0].name}
														</P>
													</View>
												</View>

												<TouchableOpacity onPress={() => setSelectedItems([])}>
													<Ionicons
														name="close"
														size={24}
														color={mutedForegroundColor}
													/>
												</TouchableOpacity>
											</View>
										)}
									</View>
								</View>
								<View className="flex flex-col w-full space-y-2 mt-6 z-10">
									<Label nativeID="message" className="text-sm">
										Details
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Textarea
											placeholder="Let us know"
											value={message}
											onChangeText={setMessage}
											className="w-full bg-muted"
										/>
									</View>
								</View>
								<View className="flex flex-col w-full space-y-2 mt-4 z-10">
									<Label nativeID="password" className="text-sm">
										Attachments
									</Label>
									<View className="flex flex-row w-full gap-2">
										<FileUpload file={fileUrl} setFile={setFileUrl} />
									</View>
								</View>
							</TabsContent>

							<TabsContent value="new_item">
								<View className="flex flex-col w-full space-y-4">
									<Label nativeID="name" className="text-sm">
										Product or location name
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="Name"
											value={productName}
											onChangeText={(text) => setProductName(text)}
											className="w-full border border-border bg-muted"
										/>
									</View>
								</View>

								<View className="flex flex-col w-full space-y-2 mt-6">
									<Label nativeID="message" className="text-sm">
										Message
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Textarea
											placeholder="Message"
											value={message}
											onChangeText={setMessage}
											className="w-full bg-muted"
										/>
									</View>
								</View>
							</TabsContent>
						</Tabs>
					</View>

					<View className="w-full mt-8 flex">
						<Button
							label="Submit"
							onPress={handleSubmit}
							className="!h-16"
							loading={loadingSubmit}
						/>
					</View>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
