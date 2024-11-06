import React, { useEffect, useState } from "react";

import Search from "../search";

const ItemSelector = ({
	items,
	setItems,
	initialItems = [],
}: {
	items: any[];
	setItems: (items: any[]) => void;
	initialItems?: any[];
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
			placeholder="Enter bottled water or filter"
			setActive={setSearchActive}
			overridePress={handleItemPress}
			hideScan
			showSearchIcon
			indices={["items", "water_filters"]}
		/>
	);
};

export default ItemSelector;
