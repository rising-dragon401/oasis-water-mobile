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
				className="!rounded-full w-[88vw] pl-4"
			/>

			<TouchableOpacity onPress={handleSearch} className="absolute right-4">
				<Octicons name="search" size={24} color="black" />
			</TouchableOpacity>
		</View>
	);
}
