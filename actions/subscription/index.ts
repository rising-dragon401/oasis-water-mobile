export const checkSubscription = async (
	uid: string | null,
	rcCustomerId?: string | null,
) => {
	const subData = {
		apiStatus: 200,
		message: "",
		data: null,
	};

	const response = await fetch(
		`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/check-subscription`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ uid, rcCustomerId }),
		},
	).catch((error) => {
		console.log("checkSubscription error", error);
		subData.apiStatus = 500;
		subData.message = "Fetch error";
		return null;
	});

	if (response) {
		if (response.status === 200) {
			const subscriptionData = await response.json();
			subData.data = subscriptionData;
			subData.message = "Success";
		} else {
			subData.apiStatus = response.status;
			subData.message = `Error: ${response.status}`;
		}
	}

	return subData;
};
