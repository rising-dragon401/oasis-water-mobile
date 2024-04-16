import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Octicons } from "@expo/vector-icons";

export default function Search() {
	const [value, setValue] = useState("");

	const onChangeText = (text: string) => {
		setValue(text);
	};

	const handleSearch = () => {};

	return (
		<View className="flex flex-row gap-2">
			<Input
				placeholder="Search water, filters, location..."
				value={value}
				onChangeText={onChangeText}
				aria-labelledbyledBy="inputLabel"
				aria-errormessage="inputError"
				className="w-96 !rounded-full"
			/>
			<Button
				className="w-14 rounded-full "
				variant="default"
				size="default"
				onPress={handleSearch}
			>
				<Octicons name="search" size={16} color="white" />
			</Button>
		</View>
	);
}
