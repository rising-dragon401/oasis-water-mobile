import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	View,
} from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

import ItemSelector from "@/components/sharable/item-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { H2, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function RequestModal() {
	const { mutedForegroundColor } = useColorScheme();
	const posthog = usePostHog();
	const showToast = useToast();

	const [tabValue, setTabValue] = useState("existing");
	const [selectedItems, setSelectedItems] = useState<any[]>([]);
	const [message, setMessage] = useState("");
	const [productName, setProductName] = useState("");

	async function handleSubmit() {
		if (!productName || !message) {
			showToast("Please fill out all fields", 2000, "bottom");
			return;
		}

		await posthog?.capture("request_modal", {
			is_existing: tabValue === "existing",
			is_new_item: tabValue === "new_item",
			selected_items: selectedItems,
			message,
			product_name: productName,
		});

		// Toast.show("Yooooo.", {
		// 	duration: Toast.durations.LONG,
		// });

		showToast("Submitted. Thanks!", 2000, "bottom");
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<RootSiblingParent>
				<View className="pt-8 px-8 pb-24 flex-1 justify-between">
					<View className="flex flex-col">
						<View className="flex flex-col justify-between items-center text-center">
							<Ionicons
								name="file-tray-outline"
								size={48}
								color="black"
								className="mb-6"
							/>
							<H2 className="text-center mt-4">Help us improve Oasis</H2>
							<Muted className="text-center">
								Share new information or suggest updates to existing entries.
								You can always email us files at research@live-oasis.com
							</Muted>
						</View>

						<Tabs
							value={tabValue}
							onValueChange={setTabValue}
							className="mt-10"
						>
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
								<View className="flex flex-col w-full space-y-4">
									<Label nativeID="item" className="text-sm">
										Which item?
									</Label>
									<View className="flex flex-row w-full gap-2">
										{!selectedItems.length ? (
											<ItemSelector
												items={selectedItems}
												setItems={setSelectedItems}
												initialItems={[]}
											/>
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
								<View className="flex flex-col w-full space-y-2 mt-6">
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
								{/* <View className="flex flex-col w-full space-y-2 mt-4">
							<Label nativeID="password" className="text-sm">
								Attachment
							</Label>
							<View className="flex flex-row w-full gap-2">
								<FileUpload file={file} setFile={setFile} />
							</View>
						</View> */}
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

					<View className="w-full mt-8">
						<Button label="Submit" onPress={handleSubmit} className="!h-16" />
					</View>
				</View>
			</RootSiblingParent>
		</KeyboardAvoidingView>
	);
}
