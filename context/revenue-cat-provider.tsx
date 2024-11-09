import { usePostHog } from "posthog-react-native";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
	CustomerInfo,
	LOG_LEVEL,
	PurchasesPackage,
} from "react-native-purchases";

import { useUserProvider } from "./user-provider";

import { updateUserRcId } from "@/actions/user";

const APIKeys = {
	apple: "appl_OIAHthcBxHjpVWGXmtLvBKRTtrR",
	google: "goog_FvkMjztDreNxCXHMlzQqreSiQxs",
};

interface RevenueCatProps {
	purchasePackage: (pack: PurchasesPackage) => Promise<boolean>;
	restorePurchases: () => Promise<CustomerInfo>;
	userSubscription: UserState;
	packages: PurchasesPackage[];
}

export interface UserState {
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
	const { subscription, uid, userData, setSubscription, fetchSubscription } =
		useUserProvider();
	const [userSubscription, setUserSubscription] = useState<UserState>({
		pro: false,
	});
	const posthog = usePostHog();

	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
	const [, setIsReady] = useState(false);

	// Configure Revenue Cat
	// Setup subscription listener
	useEffect(() => {
		const setup = async () => {
			if (Platform.OS === "ios") {
				await Purchases.configure({ apiKey: APIKeys.apple });
			} else {
				await Purchases.configure({ apiKey: APIKeys.google });
			}

			setIsReady(true);

			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			// listen for customer info updates
			// Need for restoring purchases
			// And new subscriptions
			Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
				setCustomerInfo(customerInfo);
				const rcCustomerId = customerInfo.originalAppUserId;

				// associate revenue cat customer id with user
				// originalAppUserId is assigned to one device
				// Therefor a device can't have multiple subscriptions across different users
				if (uid && !userData?.rc_customer_id && rcCustomerId) {
					updateUserRcId(uid, rcCustomerId);
				}
				// const rcCustomerId = customerInfo.originalAppUserId;
				// if (rcCustomerId && uid) {
				// 	// fetchSubscription(rcCustomerId);
				// }
			});

			await loadOfferings();
		};

		if (uid) {
			setup().catch(console.log);
		}
	}, [uid]);

	// if user purchased through web, set userSubscription to pro
	useEffect(() => {
		if (subscription) {
			setUserSubscription({ pro: true });
		}
	}, [subscription]);

	useEffect(() => {
		if (customerInfo && uid) {
			setUserSubscription({
				pro: customerInfo.entitlements.active.pro?.isActive || false,
			});
		}
	}, [customerInfo, uid]);

	// Get offerings from Revenue Cat
	const loadOfferings = async () => {
		const offerings = await Purchases.getOfferings();

		const annualPackage = offerings.current?.annual
			? [offerings.current.annual]
			: [];

		const weeklyPackage = offerings.current?.weekly
			? [offerings.current.weekly]
			: [];

		setPackages([...annualPackage, ...weeklyPackage]);
	};

	const purchasePackage = async (pack: PurchasesPackage) => {
		try {
			await Purchases.purchasePackage(pack);

			console.log("purchasePackage", pack);

			setSubscription(true);

			console.log("customerInfo", customerInfo);

			fetchSubscription({ rcCustomerId: customerInfo?.originalAppUserId });

			posthog?.capture("purchase", {
				type: "subscription",
				package: pack.identifier,
			});

			return true;
		} catch (error) {
			console.log("purchasePackage error", error);
			alert(error);

			return false;
		}
	};

	const restorePurchases = async () => {
		// Reload stripe?
		// Nah it checks stripe on app launch

		// reloads customer info
		// Triggers Purchases.addCustomerInfoUpdateListener
		const customerInfo = await Purchases.restorePurchases();
		fetchSubscription({ rcCustomerId: customerInfo.originalAppUserId });

		return customerInfo;
	};

	const value = {
		purchasePackage,
		restorePurchases,
		userSubscription,
		packages,
	};

	return (
		<RevenueCatContext.Provider value={value}>
			{children}
		</RevenueCatContext.Provider>
	);
};
