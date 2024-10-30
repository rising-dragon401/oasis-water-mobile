import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { Platform } from "react-native";
import Purchases, {
	CustomerInfo,
	LOG_LEVEL,
	PurchasesPackage,
} from "react-native-purchases";

import { useUserProvider } from "./user-provider";

import { getUserData, manageSubscriptionStatusChange } from "@/actions/user";

const APIKeys = {
	apple: "appl_OIAHthcBxHjpVWGXmtLvBKRTtrR",
	google: "goog_FvkMjztDreNxCXHMlzQqreSiQxs",
};

interface RevenueCatProps {
	purchasePackage: (pack: PurchasesPackage) => Promise<boolean>;
	restorePurchases: () => Promise<CustomerInfo>;
	refetchCustomerAndSubscription: (uid: string) => Promise<void>;
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
	const { subscription, uid, fetchSubscription, setSubscription } =
		useUserProvider();
	const [userSubscription, setUserSubscription] = useState<UserState>({
		pro: false,
	});
	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
	const [, setIsReady] = useState(false);

	useEffect(() => {
		const setup = async () => {
			if (Platform.OS === "ios") {
				await Purchases.configure({ apiKey: APIKeys.apple });
			} else {
				await Purchases.configure({ apiKey: APIKeys.google });
			}

			setIsReady(true);

			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
				setCustomerInfo(customerInfo);
				updateCustomerInfo(customerInfo, uid || "");
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
		if (customerInfo) {
			setUserSubscription({
				pro: customerInfo.entitlements.active.pro?.isActive || false,
			});
		}
	}, [customerInfo]);

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

	// console.log("packages", packages);

	const purchasePackage = async (pack: PurchasesPackage) => {
		try {
			await Purchases.purchasePackage(pack);

			if (pack.identifier === "pro") {
				setUserSubscription({ ...userSubscription, pro: true });
				setSubscription(true);
				refetchCustomerAndSubscription(uid || "");
			}

			return true;
		} catch (error) {
			console.log("purchasePackage error", error);
			alert(error);

			return false;
		}
	};

	const refetchCustomerAndSubscription = useCallback(
		async (uid: string) => {
			if (customerInfo) {
				updateCustomerInfo(customerInfo, uid);
			}
		},
		[customerInfo],
	);

	// get latest sub data from revenue cat
	const updateCustomerInfo = useCallback(
		async (customerInfo: CustomerInfo, uid: string) => {
			// console.log(
			// 	"updateCustomerInfo info",
			// 	JSON.stringify(customerInfo, null, 2),
			// );
			// console.log("updateCustomerInfo uid", uid);

			const userData = await getUserData(uid);
			// for admin use and testing
			if (userData?.do_not_override_sub) {
				return;
			}

			// manually override subscription
			if (!customerInfo || !uid) {
				console.error("No customer info or uid");
				setSubscription(false);
				return;
			}

			// setUserSubscription({
			// 	pro: customerInfo.entitlements.active.pro?.isActive || false,
			// });

			// console.log("calling manageSubscriptionStatusChange");

			const updatedSubscription = await manageSubscriptionStatusChange(
				uid,
				customerInfo,
			);

			console.log("updatedSubscription", updatedSubscription);

			// manually override subscription if there is an error with revenue cat
			if (!updatedSubscription?.success) {
				setSubscription(false);
			}

			// update user provider subscription
			fetchSubscription(uid);
		},
		[uid],
	);

	const restorePurchases = async () => {
		const customerInfo = await Purchases.restorePurchases();
		return customerInfo;
	};

	const value = {
		purchasePackage,
		restorePurchases,
		refetchCustomerAndSubscription,
		userSubscription,
		packages,
	};

	return (
		<RevenueCatContext.Provider value={value}>
			{children}
		</RevenueCatContext.Provider>
	);
};
