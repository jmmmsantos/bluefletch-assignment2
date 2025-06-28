import { CreatePost as CreatePostAPI } from "@/api";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	post: z.string().min(1, "Please input at least one (1) character."),
});

const CreatePost = ({ refreshFeed }: { refreshFeed: () => void }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			post: "",
		},
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		setIsLoading(true);
		toast.promise(CreatePostAPI({ text: data.post }), {
			loading: "Creating post...",
			success: () => {
				refreshFeed();
				setIsOpen(false);
				setIsLoading(false);
				return "Post created successfully.";
			},
			error: "Error creating post.",
		});
	};

	return (
		<Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="w-full">
					Create a new post
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create post</DialogTitle>
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
											placeholder="What's on your mind?"
											className="resize-none min-h-[150px]"
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

export default CreatePost;
