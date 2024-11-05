import React, { createContext, useCallback, useContext } from "react";
import Toast from "react-native-root-toast";

type ShowToastFunction = (
	message: string,
	duration?: number,
	position?: "top" | "bottom",
) => void;

const ToastContext = createContext<ShowToastFunction | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const showToast: ShowToastFunction = useCallback(
		(
			message: string,
			duration = Toast.durations.LONG,
			position?: "top" | "bottom",
		) => {
			const toastPosition =
				position === "top"
					? Toast.positions.TOP
					: position === "bottom"
						? Toast.positions.BOTTOM
						: -100;
			const toast = Toast.show(message, {
				duration,
				position: toastPosition,
				shadow: true,
				animation: true,
				hideOnPress: true,
				delay: 0,
				backgroundColor: "#645E58",
				textColor: "#EDE8DA",
				opacity: 1.0,
				containerStyle: {
					borderRadius: 99,
					paddingHorizontal: 16,
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
