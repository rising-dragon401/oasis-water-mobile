import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Input } from "@/components/ui/input";

export default function Search() {
	const [value, setValue] = useState("");

	const onChangeText = (text: string) => {
		setValue(text);
	};

	const handleSearch = () => {};

	return (
		<View className="flex flex-row gap-2 items-center relative">
			<Input
				placeholder="Search water, filters, location..."
				value={value}
				onChangeText={onChangeText}
				aria-labelledbyledBy="inputLabel"
				aria-errormessage="inputError"
				className="!rounded-full w-full pl-4"
			/>

			<TouchableOpacity onPress={handleSearch} className="absolute right-6">
				<Octicons name="search" size={18} color="black" />
			</TouchableOpacity>
		</View>
	);
}
