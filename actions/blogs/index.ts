import axios from "axios";

export const getEntry = async (id: string) => {
	const response = await axios.get(
		`https://favorable-chickens-2e4f30c189.strapiapp.com/api/articles/${id}?[populate]=*`,
	);

	const cover = response.data.data.attributes.cover.data.attributes.url;

	return { ...response.data.data, cover };
};
