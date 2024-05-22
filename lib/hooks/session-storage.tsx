import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

function useSessionStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		const loadStoredValue = async () => {
			try {
				const item = await AsyncStorage.getItem(key);
				if (item !== null) {
					setStoredValue(JSON.parse(item));
				}
			} catch (error) {
				console.error(error);
			}
		};

		loadStoredValue();
	}, [key]);

	const setValue = async (value: T | ((val: T) => T)) => {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue];
}

export default useSessionStorage;
