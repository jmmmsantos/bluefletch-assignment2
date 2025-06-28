import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { IFeedResponseData, TObjectComments } from "./api";
import type { IPostComments } from "./redux/features/post/slice";

dayjs.extend(utc);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const generateRandomString = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const dateFormatter = (date: string) => {
	const day = DAYS[dayjs(date).day()];
	return `${day}, ${dayjs(date).format("DD MMM YYYY hh:mm:ss a")}`;
};

export const commentParser = (data: IFeedResponseData): IPostComments[] => {
	const post_id = data.id;
	if ("comments" in data) {
		if (Array.isArray(data.comments)) {
			return data.comments.map((i) => {
				return {
					...i,
					post_id,
				};
			});
		} else {
			return Object.keys(data.comments as Object).map((j) => {
				const temp = data.comments as TObjectComments;
				return {
					...temp[j],
					post_id,
				};
			});
		}
	} else {
		return [];
	}
};
