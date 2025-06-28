import { CreateComment } from "@/api";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usePosts from "@/hooks/usePosts";
import type { IPost } from "@/redux/features/post/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	postId: string;
	setData: React.Dispatch<React.SetStateAction<IPost>>;
};

const formSchema = z.object({
	comment: z.string().min(1, {
		message: "Comment must be at least 1 character.",
	}),
});

const AddComment = ({ postId, setData }: Props) => {
	const { dispatch, actions, posts } = usePosts();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		setIsLoading(true);
		CreateComment({ postId, text: values.comment })
			.then((res) => {
				dispatch(
					actions.setPosts(
						posts.map((i) => {
							if (i.id === postId) {
								const temp = {
									...res,
									post_id: postId,
								};
								const payload = {
									...i,
									comments: i.comments ? [temp, ...i.comments] : [temp],
								};
								setData(payload);
								return payload;
							}
							return i;
						})
					)
				);
				form.reset();
			})
			.catch(() => toast.error("Error posting comment."))
			.finally(() => setIsLoading(false));
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-3 flex flex-col gap-3 px-1"
			>
				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="Write a comment" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading} type="submit">
					{isLoading ? <Loader2Icon className="animate-spin" /> : undefined}
					Submit
				</Button>
			</form>
		</Form>
	);
};

export default AddComment;
