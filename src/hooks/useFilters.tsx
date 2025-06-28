import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { setFilters } from "../redux/features/filter/slice";

const usePosts = () => {
	const username = useSelector((state: RootState) => state.filter.username);
	const limit = useSelector((state: RootState) => state.filter.limit);
	const dispatch = useDispatch<AppDispatch>();

	return {
		username,
		limit,
		dispatch,
		actions: {
			setFilters,
		},
	};
};

export default usePosts;
