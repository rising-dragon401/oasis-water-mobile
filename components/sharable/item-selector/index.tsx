import React, { useEffect, useState } from "react";

import Search from "../search";

const ItemSelector = ({
	items,
	setItems,
	initialItems = [],
	singleSelect = false,
}: {
	items: any[];
	setItems: (items: any[]) => void;
	initialItems?: any[];
	singleSelect?: boolean;
}) => {
	const [searchActive, setSearchActive] = useState(false);

	// Initialize items with initialItems if provided
	useEffect(() => {
		if (initialItems.length > 0) {
			setItems(initialItems);
		}
	}, [initialItems, setItems]);

	const handleItemPress = (item: any) => {
		if (!items.some((existingItem) => existingItem.name === item.name)) {
			setItems([...items, item]);
		}
	};

	return (
		<Search
			placeholder="Search"
			setActive={setSearchActive}
			overridePress={handleItemPress}
			hideScan
			indices={["items", "water_filters", "tap_water_locations"]}
			showRequestItem={false}
		/>
	);
};

export default ItemSelector;
