import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { IPost } from "@/redux/features/post/slice";
import { dateFormatter, generateRandomString } from "@/utils";
import React from "react";

type Props = {
	post: IPost;
	setActivePost: React.Dispatch<React.SetStateAction<IPost | null>>;
};

const Post = ({ post, setActivePost }: Props) => {
	return (
		<Card
			className="w-full hover:cursor-pointer hover:scale-105 transition-all"
			key={generateRandomString(10)}
			onClick={() => setActivePost(post)}
		>
			<CardHeader>
				<CardTitle>
					<div className="flex gap-3">
						<span>
							<img
								className="h-[40px] w-[40px] object-cover rounded-full"
								src={post.user.profilePic || undefined}
								alt=""
							/>
						</span>
						<div className="flex flex-col">
							<div className="space-x-1">
								<span className="font-bold">{`${post.user.firstName} ${post.user.lastName}`}</span>
								<span className="text-gray-500 text-sm">{`@${post.user.username}`}</span>
							</div>
							<span className="text-gray-400 text-xs">
								{dateFormatter(post.createdAt)}
							</span>
						</div>
					</div>
				</CardTitle>
				<CardAction></CardAction>
			</CardHeader>
			<CardContent>{post.text}</CardContent>
			<CardFooter>
				<div className="font-medium text-sm">
					{`Comments (${post.comments?.length || 0})`}
				</div>
			</CardFooter>
		</Card>
	);
};

export default Post;
