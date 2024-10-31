import React, { createContext, useCallback, useContext } from "react";
import Toast from "react-native-root-toast";

type ShowToastFunction = (message: string, duration?: number) => void;

const ToastContext = createContext<ShowToastFunction | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const showToast: ShowToastFunction = useCallback(
		(message: string, duration = Toast.durations.LONG) => {
			const toast = Toast.show(message, {
				duration,
				position: -100, // Example: Change position
				shadow: true, // Example: Add shadow
				animation: true, // Example: Enable animation
				hideOnPress: true, // Example: Hide on press
				delay: 0, // Example: No delay
				backgroundColor: "#645E58", // Example: Change background color
				textColor: "#EDE8DA", // Example: Change text color
				opacity: 1.0, // Example: Set opacity
				containerStyle: {
					borderRadius: 99,
				},
			});

			setTimeout(() => {
				Toast.hide(toast);
			}, duration);
		},
		[],
	);

	return (
		<ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
	);
};

export const useToast = (): ShowToastFunction => {
	const context = useContext(ToastContext);
	if (context === null) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
