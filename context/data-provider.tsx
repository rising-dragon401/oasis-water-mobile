"use client";

import { getCategories } from "actions/global";
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface DataContextType {
	categories: any[];
}

const DataContext = createContext<DataContextType | null>(null);

export const useDataProvider = () => {
	const context = useContext(DataContext);
	if (context === null) {
		throw new Error("useDataProvider must be used within a DataProvider");
	}
	return context;
};

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [categories, setCategories] = useState<any[]>([]);

	useEffect(() => {
		getCategories().then((categories) => setCategories(categories ?? []));
	}, []);

	const context = useMemo(
		() => ({
			categories,
		}),
		[categories],
	);

	return (
		<DataContext.Provider value={context}>{children}</DataContext.Provider>
	);
};

export default DataProvider;
