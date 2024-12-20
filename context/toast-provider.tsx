import React, { createContext, useCallback, useContext } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

import { useColorScheme } from "@/lib/useColorScheme";

type ShowToastFunction = (
	message: string,
	duration?: number,
	position?: "top" | "bottom",
) => void;

const ToastContext = createContext<ShowToastFunction | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const { accentColor, backgroundColor } = useColorScheme();

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
						backgroundColor: accentColor,
						textColor: backgroundColor,
						opacity: 1.0,
						containerStyle: {
							borderRadius: 24,
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
