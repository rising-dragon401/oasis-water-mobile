import { manageSubscriptionStatusChange } from "@/actions/user";
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

const APIKeys = {
	apple: "appl_OIAHthcBxHjpVWGXmtLvBKRTtrR",
};

interface RevenueCatProps {
	purchasePackage: (pack: PurchasesPackage) => Promise<void>;
	restorePermissions: () => Promise<CustomerInfo>;
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
	const { subscription, uid, fetchSubscription } = useUserProvider();
	const [userSubscription, setUserSubscription] = useState<UserState>({
		pro: false,
	});
	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [, setIsReady] = useState(false);

	useEffect(() => {
		const setup = async () => {
			if (Platform.OS === "ios") {
				await Purchases.configure({ apiKey: APIKeys.apple });
			}

			setIsReady(true);

			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
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

	const loadOfferings = async () => {
		const offerings = await Purchases.getOfferings();
		setPackages(offerings.current?.availablePackages || []);
	};

	// console.log("packages", packages);

	const purchasePackage = async (pack: PurchasesPackage) => {
		try {
			console.log("purchasePackage pack", pack);
			await Purchases.purchasePackage(pack);

			if (pack.identifier === "pro") {
				setUserSubscription({ ...userSubscription, pro: true });
			}
		} catch (error) {
			console.log("purchasePackage error", error);
			alert(error);
		}
	};

	const updateCustomerInfo = useCallback(
		async (customerInfo: CustomerInfo, uid: string) => {
			// console.log(
			// 	"updateCustomerInfo info",
			// 	JSON.stringify(customerInfo, null, 2),
			// );
			// console.log("updateCustomerInfo uid", uid);

			if (!customerInfo || !uid) {
				console.error("No customer info or uid");
				return;
			}

			// setUserSubscription({
			// 	pro: customerInfo.entitlements.active.pro?.isActive || false,
			// });

			// console.log("calling manageSubscriptionStatusChange");

			await manageSubscriptionStatusChange(uid, customerInfo);

			// update user provider subscription
			fetchSubscription(uid);
		},
		[uid],
	);

	const restorePermissions = async () => {
		const customerInfo = await Purchases.restorePurchases();
		return customerInfo;
	};

	const value = {
		purchasePackage,
		restorePermissions,
		userSubscription: userSubscription,
		packages: packages,
	};

	return (
		<RevenueCatContext.Provider value={value}>
			{children}
		</RevenueCatContext.Provider>
	);
};