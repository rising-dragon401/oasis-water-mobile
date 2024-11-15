import React, { createContext, useCallback, useContext } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
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

			// Wrap Toast.show in RootSiblingParent
			const toast = (
				<RootSiblingParent>
					{Toast.show(message, {
						duration,
						position: toastPosition,
						shadow: false,
						animation: true,
						hideOnPress: true,
						delay: 0.1,
						backgroundColor: "#EDE8DA",
						textColor: "#000000",
						opacity: 0.8,
						containerStyle: {
							borderRadius: 18,
							paddingHorizontal: 36,
							paddingVertical: 14,
						},
					})}
				</RootSiblingParent>
			);

			setTimeout(() => {
				Toast.hide(toast);
			}, duration);
		},
		[],
	);

	return (
		<ToastContext.Provider value={showToast}>
			<RootSiblingParent>{children}</RootSiblingParent>
		</ToastContext.Provider>
	);
};

export const useToast = (): ShowToastFunction => {
	const context = useContext(ToastContext);
	if (context === null) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
