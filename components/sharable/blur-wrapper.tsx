import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet } from "react-native";

type BlurWrapperProps = {
	children: React.ReactNode;
	opacity?: number; // Used for the opacity of the white cover
};

const BlurWrapper: React.FC<BlurWrapperProps> = ({
	children,
	opacity = 0.02, // Default opacity
}) => {
	return (
		<BlurView style={styles.container} intensity={100}>
			{children}
		</BlurView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
});

export default BlurWrapper;
