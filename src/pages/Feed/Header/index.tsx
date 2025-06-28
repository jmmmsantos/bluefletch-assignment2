import { GetFeed, GetUserData, Logout, UpdateUserPhoto } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import usePosts from "@/hooks/usePosts";
import { User } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import UploadPhoto from "./UpdatePhoto";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFilters from "@/hooks/useFilters";
import { commentParser } from "@/utils";

const HeaderFormSchema = z.object({
	limit: z.string().optional(),
	username: z.string().optional(),
});

const Header = () => {
	const navigate = useNavigate();
	const { dispatch: authDispatch, state } = useAuth();
	const {
		dispatch: filterDispatch,
		username,
		limit,
		actions: { setFilters },
	} = useFilters();
	const { dispatch: postDispatch, actions } = usePosts();
	const [_, setToken] = useLocalStorage("token", null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<z.infer<typeof HeaderFormSchema>>({
		resolver: zodResolver(HeaderFormSchema),
		defaultValues: {
			limit: limit ? limit.toString() : "",
			username: username || "",
		},
	});

	const onSubmit = (data: z.infer<typeof HeaderFormSchema>) => {
		filterDispatch(
			setFilters({
				limit: data.limit ? Number(data.limit) : 0,
				username: data.username || "",
			})
		);
		postDispatch(actions.getPosts());
		GetFeed({ limit: data.limit })
			.then((res) => {
				const temp = data.username
					? res.filter((i) => i.user.username === data.username)
					: res;
				postDispatch(
					actions.setPosts(
						temp.map((i) => ({
							...i,
							comments: commentParser(i),
						}))
					)
				);
			})
			.catch((e) => {
				postDispatch(actions.errorHandler());
				toast.error(e);
				navigate("/");
			});
	};

	const handleLogout = () => {
		postDispatch(actions.getPosts());
		Logout()
			.then((res) => {
				if (res) {
					setToken(null);
					authDispatch({ type: "LOGOUT" });
					navigate("/");
				}
			})
			.catch(() => toast.error("An error occurred."));
	};

	const handleSubmit = async (file: File) => {
		setIsOpen(false);
		toast("Uploading image...", {});
		const formData = new FormData();
		formData.append("profileImage", file);
		toast.promise(UpdateUserPhoto(formData), {
			loading: "Uploading image...",
			success: () => {
				GetUserData().then((res) => {
					authDispatch({ type: "SET_USER", ...res });
				});
				return "Uploaded successfully.";
			},
			error: "Error uploading image.",
		});
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex gap-1 p-2 border-b shadow-md sticky top-0 bg-white z-10 items-center"
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="h-[50px] w-[50px] mr-2 ">
								<AvatarImage src={state.profilePic || undefined} />
								<AvatarFallback className="bg-[#171717] text-white">
									<User />
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start">
							<DropdownMenuLabel>
								{state.firstName && state.lastName
									? `${state.firstName} ${state.lastName}`
									: state.username}
							</DropdownMenuLabel>
							<DropdownMenuGroup>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									<Dialog
										onOpenChange={(open) => setIsOpen(open)}
										open={isOpen}
									>
										<DialogTrigger>Update Photo</DialogTrigger>
										<DialogContent className="sm:max-w-[400px]">
											<DialogHeader>
												<DialogTitle>Update Photo</DialogTitle>
												<DialogDescription></DialogDescription>
											</DialogHeader>
											<div className="flex flex-col items-center gap-4">
												<UploadPhoto onSubmit={handleSubmit} />
											</div>
											<DialogFooter></DialogFooter>
										</DialogContent>
									</Dialog>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={() => {
									handleLogout();
								}}
							>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="grow">
								<FormControl>
									<Input placeholder="Username" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="limit"
						render={({ field }) => (
							<FormItem>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-[80px]">
											<SelectValue placeholder="Limit" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="5">5</SelectItem>
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="15">15</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="25">25</SelectItem>
										<SelectItem value="50">50</SelectItem>
										<SelectItem value="100">100</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Go</Button>
				</form>
			</Form>
		</>
	);
};

export default Header;
