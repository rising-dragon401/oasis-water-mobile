import { getBlogs } from "actions/blogs";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface BlogContextType {
	blogs: any[];
}

export const BlogContext = createContext<BlogContextType>({ blogs: [] });

export const BlogProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [blogs, setBlogs] = useState<any[]>([]);

	useEffect(() => {
		getBlogs().then(setBlogs);
	}, []);

	return (
		<BlogContext.Provider value={{ blogs }}>{children}</BlogContext.Provider>
	);
};
