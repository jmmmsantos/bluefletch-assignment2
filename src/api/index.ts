import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

interface ILoginData {
	username: string;
	password: string;
}

interface IRegisterData extends ILoginData {
	firstname: string;
	lastname: string;
}

interface IFeedPayload {
	start?: string;
	limit?: string;
}

interface ICreatePostPayload {
	text: string;
}

interface IUpdatePostPayload {
	id: string;
	text: string;
}

interface ICreateCommentPayload {
	postId: string;
	text: string;
}

interface IUpdateCommentPayload {
	postId: string;
	id: string | number;
	text: string;
}

export type TArrayComments = {
	POST_ID: string;
	createdAt: string;
	id: number;
	text: string;
	timestamp: number;
	updatedAt: string;
	username: string;
};

export type TObjectComments = {
	[key: string]: {
		createdAt: string;
		id: number;
		text: string;
		timestamp: number;
		updatedAt: string;
		username: string;
	};
};

export type TComments =
	| {
			POST_ID: string;
			createdAt: string;
			id: number;
			text: string;
			timestamp: number;
			updatedAt: string;
			username: string;
	  }[]
	| {
			[key: string]: {
				createdAt: string;
				id: number;
				text: string;
				timestamp: number;
				updatedAt: string;
				username: string;
			};
	  };

export interface IFeedResponseData {
	comments?: TComments;
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

export interface IGetUserResponseData {
	profilePic: string;
	username: string;
	firstName: string;
	lastName: string;
}

const rejectHandler = (status: number, reject: (reason?: any) => void) => {
	switch (status) {
		case 403:
			return reject("Unauthorized.");
		default:
			return reject("Internal server error.");
	}
};

export const Login = (
	data: ILoginData,
	signal?: AbortSignal
): Promise<string> =>
	new Promise((resolve, reject) => {
		axios
			.post("/account/login", data, {
				baseURL: BASE_URL,
				signal,
			})
			.then((res) => {
				const token = res.data.token;
				axios.defaults.headers.common["Authorization"] = token;
				resolve(token);
			})
			.catch((e) => {
				const message =
					e.name === "AbortError" || e.name === "CanceledError"
						? "Request Cancelled"
						: e.response.data.message || "User not found.";
				reject(message);
			});
	});

export const Logout = (): Promise<boolean> =>
	new Promise((resolve, reject) => {
		axios
			.put(
				"/account/logout",
				{},
				{
					baseURL: BASE_URL,
				}
			)
			.then((res) => {
				if (res.status !== 202) {
					throw new Error();
				}
				axios.defaults.headers.common["Authorization"] = undefined;
				resolve(true);
			})
			.catch(() => {
				reject(false);
			});
	});

export const Register = (
	data: IRegisterData,
	signal?: AbortSignal
): Promise<string> =>
	new Promise((resolve, reject) => {
		axios
			.post("/account/create", data, {
				baseURL: BASE_URL,
				signal,
			})
			.then((res) => {
				const token = res.data.token;
				axios.defaults.headers.common["Authorization"] = token;
				resolve(token);
			})
			.catch((e) => {
				const message =
					e.name === "AbortError" || e.name === "CanceledError"
						? "Request Cancelled"
						: e.response.data.message || "User not found.";
				reject(message);
			});
	});

export const GetUserData = (
	signal?: AbortSignal
): Promise<IGetUserResponseData> =>
	new Promise((resolve, reject) => {
		axios
			.get("/user", {
				baseURL: BASE_URL,
				signal,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				reject(e);
			});
	});

export const UpdateUserPhoto = (formData: FormData): Promise<boolean> =>
	new Promise((resolve, reject) => {
		axios
			.post("/user/picture", formData, {
				headers: { "Content-Type": "multipart/form-data" },
				baseURL: BASE_URL,
			})
			.then((res) => {
				resolve(res.status === 200);
			})
			.catch((e) => {
				reject(e);
			});
	});

export const GetFeed = (
	params: IFeedPayload,
	signal?: AbortSignal
): Promise<IFeedResponseData[]> =>
	new Promise((resolve, reject) => {
		axios
			.get("/feed", {
				baseURL: BASE_URL,
				params,
				signal,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				reject(e);
			});
	});

export const CreatePost = (
	payload: ICreatePostPayload
): Promise<IFeedResponseData> =>
	new Promise((resolve, reject) => {
		axios
			.post("/feed/post", payload, {
				baseURL: BASE_URL,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				reject(e);
			});
	});

export const UpdatePost = (
	payload: IUpdatePostPayload
): Promise<IFeedResponseData> =>
	new Promise((resolve, reject) => {
		axios
			.put("/feed/post", payload, {
				baseURL: BASE_URL,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				rejectHandler(e.status, reject);
			});
	});

interface ICreateCommentResponse {
	createdAt: string;
	id: number;
	text: string;
	updatedAt: string;
	username: string;
}

export const CreateComment = ({
	postId,
	...payload
}: ICreateCommentPayload): Promise<ICreateCommentResponse> =>
	new Promise((resolve, reject) => {
		axios
			.post(`/feed/${postId}/comment`, payload, {
				baseURL: BASE_URL,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				reject(e);
			});
	});

export const UpdateComment = ({
	postId,
	...payload
}: IUpdateCommentPayload): Promise<IFeedResponseData[]> =>
	new Promise((resolve, reject) => {
		axios
			.put(`/feed/${postId}/comment`, payload, {
				baseURL: BASE_URL,
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((e) => {
				rejectHandler(e, reject);
			});
	});
