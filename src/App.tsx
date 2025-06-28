import { Toaster } from "sonner";
import Routes from "./routes";

const App = () => {
	return (
		<main className="m-auto h-full justify-items-center content-center md:max-w-[500px]">
			<Toaster richColors position="top-center" />
			<Routes />
		</main>
	);
};

export default App;
