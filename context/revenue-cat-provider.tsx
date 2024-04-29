import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
	CustomerInfo,
	LOG_LEVEL,
	PurchasesPackage,
} from "react-native-purchases";

const APIKeys = {
	apple: "appl_OIAHthcBxHjpVWGXmtLvBKRTtrR",
};

interface RevenueCatProps {
	purchasePackage: (pack: PurchasesPackage) => Promise<void>;
	restorePermissions: () => Promise<CustomerInfo>;
	userSubscription: UserState;
	package: PurchasesPackage[];
}

export interface UserState {
	cookies: number;
	items: string[];
	pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const useRevenueCat = () => {
	const context = useContext(RevenueCatContext);

	if (!context) {
		throw new Error("useRevenueCat must be used within a RevenueCatProvider");
	}

	return context;
};

export const RevenueCatProvider = ({ children }: any) => {
	const [userSubscription, setUserSubscription] = useState<UserState>({
		cookies: 0,
		items: [],
		pro: false,
	});
	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const setup = async () => {
			if (Platform.OS === "ios") {
				await Purchases.configure({ apiKey: APIKeys.apple });
			}

			setIsReady(true);

			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			await loadOfferings();
		};

		setup().catch(console.log);
	}, []);

	const loadOfferings = async () => {
		const offerings = await Purchases.getOfferings();
		console.log("offerings", offerings);
		setPackages(offerings.current?.availablePackages || []);
	};

	console.log("packages", packages);

	const purchasePackage = async (pack: PurchasesPackage) => {};

	const updateCustomerInfo = async (customerInfo: CustomerInfo) => {};

	const restorePermissions = async () => {
		const customerInfo = await Purchases.restorePurchases();
		return customerInfo;
	};

	const value = {
		purchasePackage,
		restorePermissions,
		userSubscription: userSubscription,
		package: packages,
	};

	return (
		<RevenueCatContext.Provider value={value}>
			{children}
		</RevenueCatContext.Provider>
	);
};
