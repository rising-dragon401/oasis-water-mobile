import axios from "axios";

export const getEntry = async (id: string) => {
	const response = await axios.get(
		`https://favorable-chickens-2e4f30c189.strapiapp.com/api/articles/${id}?[populate]=*`,
	);

	const cover = response.data.data.attributes.cover.data.attributes.url;

	return { ...response.data.data, cover };
};

export const getBlogs = async () => {
	try {
		try {
			const response = await axios.get(
				"https://favorable-chickens-2e4f30c189.strapiapp.com/api/articles",
			);
			const blogEntries = await Promise.all(
				response.data.data.map(async (item: any) => {
					const entry = await getEntry(item.id);
					return entry;
				}),
			);
			return blogEntries;
		} catch (error) {
			console.error("Error fetching food data:", error);
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	return [];
};
