import { dateFormatter } from "@/utils";
import { useState } from "react";
import Edit from "./Edit";
import type { IPostComments } from "@/redux/features/post/slice";
import { useAuth } from "@/hooks/useAuth";

type Props = {
	comment: IPostComments;
};

const Comment = ({ comment }: Props) => {
	const { state } = useAuth();
	const [data, setData] = useState(comment);

	return (
		<div>
			<div className="space-y-2 bg-gray-100 p-3 rounded-md">
				<div className="flex justify-between">
					<span>
						<div className="font-bold">@{data.username}</div>
						<div className="text-xs">{dateFormatter(data.createdAt)}</div>
					</span>
					{state.username === data.username && (
						<Edit comment={data} setData={setData} />
					)}
				</div>
				<div>{data.text}</div>
			</div>
		</div>
	);
};

export default Comment;
