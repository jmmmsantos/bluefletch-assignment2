import { UpdateComment } from "@/api";
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
import { Input } from "@/components/ui/input";
import type { IPostComments } from "@/redux/features/post/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	comment: IPostComments;
	setData: React.Dispatch<React.SetStateAction<IPostComments>>;
};

const FormSchema = z.object({
	comment: z.string().min(1, "Please input at least one (1) character."),
});

const EditComment = ({ comment, setData }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			comment: comment.text,
		},
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		setIsLoading(true);
		toast.promise(
			UpdateComment({
				postId: comment.post_id,
				id: comment.id,
				text: data.comment,
			}),
			{
				loading: "Updating comment...",
				success: () => {
					setData({
						...comment,
						text: data.comment,
					});
					setIsOpen(false);
					return "Comment updated successfully.";
				},
				error: (e) => {
					return e || "Error updating comment.";
				},
				finally: () => {
					setIsLoading(false);
				},
			}
		);
	};

	return (
		<Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer" variant="ghost">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit comment</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6"
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

export default EditComment;
