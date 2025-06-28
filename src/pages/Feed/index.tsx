import { useEffect, useState } from "react";
import { GetFeed, GetUserData } from "@/api";
import { commentParser, generateRandomString } from "@/utils";
import axios from "axios";
import { toast } from "sonner";
import LoadingScreen from "@/components/Loading";
import { useNavigate } from "react-router";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import usePosts from "@/hooks/usePosts";
import Header from "./Header";
import { useAuth } from "@/hooks/useAuth";
import CreatePost from "./Post/Create";
import Post from "./Post";
import ViewPost from "./Post/ViewPost";
import type { IPost } from "@/redux/features/post/slice";
import useFilters from "@/hooks/useFilters";

const Feed = () => {
	const navigate = useNavigate();
	const { dispatch: authDispatch } = useAuth();
	const { username, limit } = useFilters();
	const { isLoading, posts, dispatch, actions } = usePosts();
	const [token] = useLocalStorage("token", null);
	const [activePost, setActivePost] = useState<IPost | null>(null);

	const refreshFeed = () =>
		new Promise((resolve, reject) => {
			GetFeed({
				limit: String(limit),
			})
				.then((res) => {
					const temp = res.map((i) => ({
						...i,
						comments: commentParser(i),
					}));
					dispatch(
						actions.setPosts(
							username
								? temp.filter(({ user }) => username === user.username)
								: temp
						)
					);
					resolve(true);
				})
				.catch((e) => {
					if (!(axios.isCancel(e) || e.name === "CanceledError")) {
						dispatch(actions.errorHandler());
						toast.error(e.response.data?.message);
						navigate("/");
						reject(false);
					}
				});
		});

	const handleReturn = (id: string) => {
		setActivePost(null);
		dispatch(actions.getPosts());
		refreshFeed().then(() => {
			const element = window.document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: "instant", block: "center" });
			}
		});
	};

	useEffect(() => {
		const controller = new AbortController();
		if (token) {
			axios.defaults.headers.common["Authorization"] = token;
			dispatch(actions.getPosts());
			GetUserData(controller.signal)
				.then((res) => {
					authDispatch({ type: "SET_USER", ...res });
					GetFeed({}, controller.signal).then((res) => {
						dispatch(
							actions.setPosts(
								res.map((i) => ({
									...i,
									comments: commentParser(i),
								}))
							)
						);
					});
				})
				.catch((e) => {
					if (!(e.name === "CanceledError")) {
						dispatch(actions.errorHandler());
						toast.error(e.response.data?.message);
						navigate("/");
					}
				});
		} else {
			navigate("/");
		}

		return () => {
			controller.abort();
		};
	}, []);

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (activePost) {
		return <ViewPost post={activePost} handleReturn={handleReturn} />;
	}

	return (
		<div className={`w-full ${!posts.length && "h-full"}`}>
			<Header />
			<div className="flex flex-col gap-5 p-5">
				<CreatePost refreshFeed={refreshFeed} />
				{posts.length ? (
					posts.map((i) => (
						<span id={i.id} key={generateRandomString(10)}>
							<Post setActivePost={setActivePost} post={i} />
						</span>
					))
				) : (
					<div>Empty list</div>
				)}
			</div>
		</div>
	);
};

export default Feed;
