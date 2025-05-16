import * as fs from "node:fs";

export const Route = createFileRoute({
	component: Home,
	/* Requires src/server.ts */
	loader: async () => {
		const data = await fs.promises.readFile("server.txt", "utf-8");
		return data;
	},
});

function Home() {
	const data = Route.useLoaderData();

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold">Hello world!</h1>
			<p>
				Server text: <span className="text-blue-500 font-medium">{data}</span>
			</p>
		</main>
	);
}
