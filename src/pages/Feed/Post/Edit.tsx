import { UpdatePost } from "@/api";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { IPost } from "@/redux/features/post/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	post: IPost;
	setData: React.Dispatch<React.SetStateAction<IPost>>;
};

const FormSchema = z.object({
	post: z.string().min(1, "Please input at least one (1) character."),
});

const EditPost = ({ post, setData }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			post: post.text,
		},
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		setIsLoading(true);
		toast.promise(UpdatePost({ text: data.post, id: post.id }), {
			loading: "Updating post...",
			success: () => {
				setData({
					...post,
					text: data.post,
				});
				setIsOpen(false);
				return "Post updating successfully.";
			},
			error: (e) => {
				return e || "Error updating post.";
			},
			finally: () => {
				setIsLoading(false);
			},
		});
	};

	useEffect(() => {
		form.setValue("post", post.text);
	}, []);

	return (
		<Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer" variant="ghost">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit post</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6"
					>
						<FormField
							control={form.control}
							name="post"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											id="edit-post-1"
											placeholder="What's on your mind?"
											className="resize-none min-h-[150px] max-h-[300px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isLoading} type="submit" className="w-full">
							{isLoading ? <Loader2Icon className="animate-spin" /> : undefined}
							Submit
						</Button>
					</form>
				</Form>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditPost;
