import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const determineLink = (item: any) => {
	let basePath = "";

	if (item?.type === "tap_water") {
		basePath = `/search/location/${item?.id}`;
	} else if (
		item?.type === "filter" ||
		item?.type === "shower_filter" ||
		item?.type === "bottle_filter"
	) {
		basePath = `/search/filter/${item?.id}`;
	} else if (item?.type === "user") {
		basePath = `/search/oasis/${item?.id}`;
	} else if (item?.type === "category") {
		basePath = `/search/top-rated/${item?.typeId}?tags=${item?.tags?.join(",")}&catId=${item.id}`;
	} else {
		basePath = `/search/item/${item?.id}`;
	}

	return basePath;
};

export const readableType = (type: string) => {
	if (type === "tap_water") {
		return "Tap water";
	} else if (type === "filter") {
		return "Filter";
	} else if (type === "company") {
		return "Company";
	} else if (type === "item") {
		return "Bottled water";
	} else if (type === "bottle_filter") {
		return "Filter";
	} else if (type === "category") {
		return "Category";
	} else {
		return "Bottled water";
	}
};

export const timeSince = (date: string) => {
	const now = new Date();
	const createdAt = new Date(date);
	const diffTime = Math.abs(now.getTime() - createdAt.getTime());

	const diffSeconds = Math.floor(diffTime / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSeconds < 60) {
		return `${diffSeconds} seconds ago`;
	} else if (diffMinutes < 60) {
		return `${diffMinutes} minutes ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hours ago`;
	} else {
		return `${diffDays} days ago`;
	}
};

export function generateLoremIpsum(letterCount: number) {
	const loremWords = [
		"lorem",
		"ipsum",
		"dolor",
		"sit",
		"amet",
		"consectetur",
		"adipiscing",
		"elit",
		"sed",
		"do",
		"eiusmod",
		"tempor",
		"incididunt",
		"ut",
		"labore",
		"et",
		"dolore",
		"magna",
		"aliqua",
		"ut",
		"enim",
		"ad",
		"minim",
		"veniam",
		"quis",
		"nostrud",
		"exercitation",
		"ullamco",
		"laboris",
		"nisi",
		"aliquip",
		"ex",
		"ea",
		"commodo",
		"consequat",
		"duis",
		"aute",
		"irure",
		"dolor",
		"in",
		"reprehenderit",
		"in",
		"voluptate",
		"velit",
		"esse",
		"cillum",
		"eu",
		"fugiat",
		"nulla",
		"pariatur",
		"excepteur",
		"sint",
		"occaecat",
		"cupidatat",
		"non",
		"proident",
		"sunt",
		"in",
		"culpa",
		"qui",
		"officia",
		"deserunt",
		"mollit",
		"anim",
		"id",
		"est",
		"laborum",
		"phasellus",
		"viverra",
		"tristique",
		"purus",
		"elementum",
		"sapien",
		"mauris",
		"augue",
		"facilisis",
		"ornare",
		"lacus",
		"bibendum",
		"tincidunt",
		"vel",
		"sociis",
		"penatibus",
		"magnis",
		"dis",
		"parturient",
		"montes",
		"nascetur",
		"ridiculus",
		"mus",
		"porta",
		"pulvinar",
		"cras",
		"tincidunt",
		"nibh",
		"risus",
		"vehicula",
		"diam",
		"aliquam",
		"quisque",
		"varius",
	];

	let result = "";
	while (result.length < letterCount) {
		const word = loremWords[Math.floor(Math.random() * loremWords.length)];
		if (result.length + word.length + 1 > letterCount) break;
		result += (result ? " " : "") + word;
	}

	return result;
}
