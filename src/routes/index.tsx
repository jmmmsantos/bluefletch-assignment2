import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed/index";
import { Suspense } from "react";
import LoadingScreen from "@/components/Loading";

const Router = () => {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingScreen />}>
				<Routes>
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Login />} />
					<Route path="/feed" element={<Feed />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

export default Router;
