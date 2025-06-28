import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { getPosts, setPosts, errorHandler } from "../redux/features/post/slice";

const usePosts = () => {
	const posts = useSelector((state: RootState) => state.post.posts);
	const isLoading = useSelector((state: RootState) => state.post.isLoading);
	const hasError = useSelector((state: RootState) => state.post.hasError);
	const dispatch = useDispatch<AppDispatch>();

	return {
		posts,
		isLoading,
		hasError,
		dispatch,
		actions: {
			getPosts,
			setPosts,
			errorHandler,
		},
	};
};

export default usePosts;
