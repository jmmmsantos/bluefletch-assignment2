import { useNavigate } from "react-router";
import { Register } from "../api";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
	firstname: z.string().min(1, {
		message: "First Name is required.",
	}),
	lastname: z.string().min(1, {
		message: "Last Name is required.",
	}),
	username: z.string().min(1, {
		message: "Username is required.",
	}),
	password: z.string().min(1, {
		message: "Password is required.",
	}),
});

const RegisterPage = () => {
	const controllerRef = useRef<AbortController | null>(null);
	const { dispatch } = useAuth();
	const [token, setToken] = useLocalStorage("token", null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstname: "",
			lastname: "",
			username: "",
			password: "",
		},
	});

	const handleSignIn = () => {
		controllerRef.current?.abort();
		navigate("/");
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		controllerRef.current = new AbortController();
		setIsLoading(true);
		Register(
			{
				username: values.username,
				password: values.password,
				firstname: values.firstname,
				lastname: values.lastname,
			},
			controllerRef.current.signal
		)
			.then((token: string) => {
				setToken(token);
				dispatch({ type: "LOGIN", token });
				navigate("/", { replace: true });
			})
			.catch((e) => {
				if (!(axios.isCancel(e) || e === "Request Cancelled")) {
					toast.error(e);
				}
			})
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		if (token) {
			setToken(token);
			axios.defaults.headers.common["Authorization"] = token;
			dispatch({ type: "LOGIN", token });
			navigate("/feed");
		}
	}, []);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 w-full max-w-sm px-5"
			>
				<div className="text-2xl font-bold">Register</div>
				<FormField
					control={form.control}
					name="firstname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder="Juan" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder="Dela Cruz" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="JuanDelaCruz123" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input placeholder="••••••••••••" type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<Button type="submit" className="w-full">
						{isLoading ? <Loader2Icon className="animate-spin" /> : undefined}
						Sign up
					</Button>
					<div className="flex items-center justify-center">
						<span>Already have an account?</span>
						<Button onClick={handleSignIn} type="button" variant="link">
							Sign In
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default RegisterPage;
