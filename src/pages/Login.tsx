import { useNavigate } from "react-router";
import { Login } from "../api";
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
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
	username: z.string({
		required_error: "Username is required.",
	}),
	password: z.string({
		required_error: "Password is required.",
	}),
});

const LoginPage = () => {
	const controllerRef = useRef<AbortController | null>(null);
	const { dispatch } = useAuth();
	const [token, setToken] = useLocalStorage("token", null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const handleRegister = () => {
		controllerRef.current?.abort();
		navigate("/register");
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		controllerRef.current = new AbortController();
		setIsLoading(true);
		Login(
			{
				username: values.username,
				password: values.password,
			},
			controllerRef.current.signal
		)
			.then((token: string) => {
				setToken(token);
				dispatch({ type: "LOGIN", token });
				navigate("/feed", { replace: true });
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
				<div className="text-2xl font-bold">Login</div>
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
					<Button disabled={isLoading} type="submit" className="w-full">
						{isLoading ? <Loader2Icon className="animate-spin" /> : undefined}
						Sign in
					</Button>
					<div className="flex items-center justify-center">
						<span>Don't have an account?</span>
						<Button onClick={handleRegister} type="button" variant="link">
							Sign up
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default LoginPage;
