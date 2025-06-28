import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dateFormatter, generateRandomString } from "@/utils";
import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import AddComment from "../Comment/Create";
import { Button } from "@/components/ui/button";
import Comment from "@/pages/Feed/Comment";
import type { IPost } from "@/redux/features/post/slice";
import EditPost from "./Edit";
import { useAuth } from "@/hooks/useAuth";

type Props = {
	post: IPost;
	handleReturn: (id: string) => void;
};

const ViewPost = ({ post, handleReturn }: Props) => {
	const { state } = useAuth();
	const [data, setData] = useState<IPost>(post);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="w-full p-5" key={generateRandomString(10)}>
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex gap-3">
							<span>
								<Avatar>
									<AvatarImage src={data.user.profilePic || undefined} />
									<AvatarFallback>
										<User />
									</AvatarFallback>
								</Avatar>
							</span>
							<div className="flex flex-col">
								<div className="space-x-1">
									<span className="font-bold">{`${data.user.firstName} ${data.user.lastName}`}</span>
									<span className="text-gray-500 text-sm">{`@${data.user.username}`}</span>
								</div>
								<span className="text-gray-400 text-xs">
									{dateFormatter(data.createdAt)}
								</span>
							</div>
						</div>
					</CardTitle>
					<CardAction>
						{state.username === data.user.username && (
							<EditPost post={data} setData={setData} />
						)}
						<Button
							className="cursor-pointer"
							variant="ghost"
							onClick={() => handleReturn(data.id)}
						>
							<X />
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="min-h-[5vh]">{data.text}</CardContent>
				<CardFooter>
					<div className="w-full space-y-5">
						<AddComment postId={data.id} setData={setData} />
						<div>
							{data.comments?.length ? (
								<div className="flex-col space-y-3 overflow-y-auto">
									{data.comments?.map((comment) => {
										return (
											<Comment
												comment={comment}
												key={generateRandomString(10)}
											/>
										);
									})}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ViewPost;
