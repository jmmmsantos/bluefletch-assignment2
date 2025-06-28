import React, {
	createContext,
	useContext,
	useReducer,
	type ReactNode,
} from "react";

type TAuthState = {
	token: string;
	profilePic: string;
	username: string;
	firstName: string;
	lastName: string;
};

type TAuthAction = {
	type: "LOGIN" | "LOGOUT" | "SET_USER";
	token?: string;
	profilePic?: string;
	username?: string;
	firstName?: string;
	lastName?: string;
};

const initialState: TAuthState = {
	token: "",
	firstName: "",
	lastName: "",
	username: "",
	profilePic: "",
};

const reducer = (state: TAuthState, action: TAuthAction): TAuthState => {
	switch (action.type) {
		case "SET_USER":
			return {
				...state,
				firstName: action.firstName || "",
				lastName: action.lastName || "",
				username: action.username || "",
				profilePic: action.profilePic || "",
			};
		case "LOGIN":
			return {
				...state,
				token: action.token || "",
			};
		case "LOGOUT":
			return {
				...state,
				token: "",
				firstName: "",
				lastName: "",
				username: "",
				profilePic: "",
			};
		default:
			return state;
	}
};

const AuthContext = createContext<{
	state: TAuthState;
	dispatch: React.Dispatch<TAuthAction>;
}>({
	state: initialState,
	dispatch: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
