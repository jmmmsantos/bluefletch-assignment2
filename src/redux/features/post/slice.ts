import { createSlice } from "@reduxjs/toolkit";

export interface IPostComments {
	createdAt: string;
	post_id: string;
	id: number;
	text: string;
	timestamp?: number;
	updatedAt: string;
	username: string;
}

export interface IPost {
	comments?: IPostComments[];
	createdAt: string;
	id: string;
	text: string;
	updatedAt: string;
	user: {
		username: string;
		firstName: string;
		lastName: string;
		profilePic: string;
	};
}

interface IPostState {
	posts: IPost[];
	isLoading: boolean;
	hasError: boolean;
}

const initialState: IPostState = {
	posts: [],
	isLoading: false,
	hasError: false,
};

export const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPosts: (state, { payload }: { payload: IPost[] }) => {
			return {
				...state,
				isLoading: false,
				hasError: false,
				posts: payload,
			};
		},
		getPosts: (state) => {
			return {
				...state,
				isLoading: true,
				hasError: false,
			};
		},
		errorHandler: (state) => {
			return {
				...state,
				isLoading: false,
				hasError: true,
			};
		},
	},
});

export const { setPosts, getPosts, errorHandler } = postSlice.actions;
export default postSlice.reducer;
