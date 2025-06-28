import { createSlice } from "@reduxjs/toolkit";

interface IFilterState {
	username: string;
	limit: number;
}

const initialState: IFilterState = {
	username: "",
	limit: 25,
};

export const filterSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		setFilters: (state, { payload }: { payload: Partial<IFilterState> }) => {
			return {
				...state,
				limit: payload.limit || 25,
				username: payload.username || "",
			};
		},
	},
});

export const { setFilters } = filterSlice.actions;
export default filterSlice.reducer;
