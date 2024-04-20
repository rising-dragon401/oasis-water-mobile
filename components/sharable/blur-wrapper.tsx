import React from "react";
import { StyleSheet, View } from "react-native";

type BlurWrapperProps = {
	children: React.ReactNode;
	opacity?: number; // Used for the opacity of the white cover
};

const BlurWrapper: React.FC<BlurWrapperProps> = ({
	children,
	opacity = 0.02, // Default opacity
}) => {
	return <View style={[styles.whiteCover, { opacity }]}>{children}</View>;
};

const styles = StyleSheet.create({
	whiteCover: {
		backgroundColor: "#000", // White color cover
		borderRadius: 20, // Example of applying a border radius
		overflow: "hidden",
		// flex: 1, // Ensure it fills the container as needed, adjust as necessary
	},
});

export default BlurWrapper;
