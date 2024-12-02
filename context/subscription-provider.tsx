import { usePostHog } from "posthog-react-native";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
	CustomerInfo,
	LOG_LEVEL,
	PurchasesPackage,
} from "react-native-purchases";

import { useUserProvider } from "./user-provider";

import { getStripeSubscription, updateUserRcId } from "@/actions/user";

export type Features =
	| "onboarding"
	| "top-rated"
	| "scan"
	| "item-analysis" // includes scores
	| "recommended-filters"
	| "profile-scores"
	| "settings-upgrade";

export type Components = "water-scores" | "contaminant-table";

export type SubscriptionSource = {
	feature: Features | string | null; // feature user is interacting with
	path: string | null; // path of the page
	component: Components | string | null; // component user clicked
	productId?: string | null; // productId of the item user is interacting with
	productType?: string | null; // productType of the item user is interacting with
};

const APIKeys = {
	apple: "appl_OIAHthcBxHjpVWGXmtLvBKRTtrR",
	google: "goog_FvkMjztDreNxCXHMlzQqreSiQxs",
};

interface SubscriptionProps {
	purchasePackage: (
		pack: PurchasesPackage,
		subscriptionSource?: SubscriptionSource,
	) => Promise<boolean>;
	restorePurchases: () => Promise<CustomerInfo>;
	checkForSubscription: () => Promise<void>;
	userSubscription: UserState;
	hasActiveSub: boolean;
	packages: {
		annual: PurchasesPackage | null;
		weekly: PurchasesPackage | null;
	};
}

export interface UserState {
	pro: boolean;
}

const SubscriptionContext = createContext<SubscriptionProps | null>(null);

export const useSubscription = () => {
	const context = useContext(SubscriptionContext);

	if (!context) {
		throw new Error(
			"useSubscription must be used within a SubscriptionProvider",
		);
	}
	return context;
};

export const SubscriptionProvider = ({ children }: any) => {
	const { uid, userData } = useUserProvider();
	const [userSubscription, setUserSubscription] = useState<UserState>({
		pro: false,
	});
	const posthog = usePostHog();

	const [packages, setPackages] = useState<{
		annual: PurchasesPackage | null;
		weekly: PurchasesPackage | null;
	}>({
		annual: null,
		weekly: null,
	});
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
	const [, setIsReady] = useState(false);
	const [hasActiveSub, setHasActiveSub] = useState(false);

	// Configure Revenue Cat
	// Setup subscription listener
	useEffect(() => {
		const setup = async () => {
			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			if (Platform.OS === "ios") {
				await Purchases.configure({ apiKey: APIKeys.apple });
			} else {
				await Purchases.configure({ apiKey: APIKeys.google });
			}

			console.log("Purchases.configured!");

			setIsReady(true);

			// check for user subscription
			await checkForSubscription();

			// listen for customer info updates
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

		const currentOffering = offerings.current;

		const annualPackage = currentOffering?.annual || null;
		const weeklyPackage = currentOffering?.weekly || null;

		setPackages({
			annual: annualPackage,
			weekly: weeklyPackage,
		});
	};

	const purchasePackage = async (
		pack: PurchasesPackage,
		subscriptionSource?: SubscriptionSource,
	) => {
		try {
			console.log(
				"purchasePackage subscriptionSource",
				JSON.stringify(subscriptionSource),
			);

			await Purchases.purchasePackage(pack);

			setHasActiveSub(true);

			posthog?.capture("purchase", {
				type: "subscription",
				package: pack.identifier,
				feature: subscriptionSource?.feature,
				path: subscriptionSource?.path,
				component: subscriptionSource?.component,
				productId: subscriptionSource?.productId,
				productType: subscriptionSource?.productType,
			});

			return true;
		} catch (error) {
			console.log("purchasePackage error", error);
			alert(error);

			return false;
		}
	};

	const checkForSubscription = async () => {
		// First check for revenue cat subscription
		const rcSub = await checkRevenueCatSubscription();
		console.log("has active rc sub", rcSub);
		// const rcSub = false;
		if (rcSub) {
			setHasActiveSub(true);
		} else {
			// no rc sub found so check if they prev subbed through stripe
			const stripeSub = await checkForStripeSubscription();
			console.log("has active stripe sub", stripeSub);
			if (stripeSub) {
				setHasActiveSub(true);
			}
		}
	};

	// This should sufficiently check for active mobile subscription
	const checkRevenueCatSubscription = async () => {
		const customerInfo = await Purchases.getCustomerInfo();

		console.log(
			"checkSubscription activeSubscriptions",
			customerInfo.activeSubscriptions,
		);

		const hasActiveSubscription = customerInfo.activeSubscriptions.length > 0;

		return hasActiveSubscription;
	};

	const checkForStripeSubscription = async () => {
		if (!uid) {
			return false;
		}

		const stripeSubData = await getStripeSubscription(uid);

		const hasActiveStripeSub = stripeSubData.success;

		return hasActiveStripeSub;
	};

	const restorePurchases = async () => {
		const customerInfo = await Purchases.restorePurchases();

		return customerInfo;
	};

	const value = {
		purchasePackage,
		restorePurchases,
		checkForSubscription,
		userSubscription,
		hasActiveSub,
		packages,
	};

	return (
		<SubscriptionContext.Provider value={value}>
			{children}
		</SubscriptionContext.Provider>
	);
};
