import { BlurView } from "expo-blur";
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
	return (
		<View style={styles.wrapper}>
			<BlurView style={styles.blurView} intensity={50} tint="light">
				<View style={[styles.overlay, { opacity }]} />
				{children}
			</BlurView>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
	},
	blurView: {
		width: "100%",
		padding: 10, // Adjust padding as needed
		borderRadius: 10, // Optional: to match the rounded style
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "white",
	},
});

export default BlurWrapper;
