import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../redux/features/post/slice";
import filterReducer from "../redux/features/filter/slice";

export const store = configureStore({
	reducer: {
		post: postReducer,
		filter: filterReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
