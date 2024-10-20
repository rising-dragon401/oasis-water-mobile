import React, { createContext, useCallback, useContext } from "react";
import Toast from "react-native-root-toast";

type ShowToastFunction = (message: string, duration?: number) => void;

const ToastContext = createContext<ShowToastFunction | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const showToast: ShowToastFunction = useCallback(
		(message: string, duration = Toast.durations.LONG) => {
			console.log("Showing toast: ", message);
			const toast = Toast.show(message, {
				duration,
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
