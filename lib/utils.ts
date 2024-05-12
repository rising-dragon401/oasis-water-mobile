import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const determineLink = (item: any) => {
	let basePath = "";

	if (item?.type === "tap_water") {
		basePath = `/search/location/${item?.id}`;
	} else if (item?.type === "filter") {
		basePath = `/search/filter/${item?.id}`;
	} else if (item?.type === "user") {
		basePath = `/search/oasis/${item?.id}`;
	} else {
		basePath = `/search/item/${item?.id}`;
	}

	return basePath;
};
