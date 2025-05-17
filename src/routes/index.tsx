import * as fs from "node:fs";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
	return Number.parseInt(
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
	);
}

const getCount = createServerFn({
	method: "GET",
}).handler(() => {
	return readCount();
});

const updateCount = createServerFn({ method: "POST" })
	.validator((d: number) => d)
	.handler(async ({ data }) => {
		const count = await readCount();
		await fs.promises.writeFile(filePath, `${count + data}`);
	});

export const Route = createFileRoute({
	component: Home,
	/* Requires src/server.ts */
	loader: async () => getCount(),
});

function Home() {
	const router = useRouter();
	const count = Route.useLoaderData();

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold">Hello world!</h1>
			<p>
				Counter: <span className="text-blue-500 font-medium">{count}</span>
			</p>
			<button
				type="button"
				className="mt-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
				onClick={() => {
					updateCount({ data: 1 }).then(() => {
						router.invalidate();
					});
				}}
			>
				Increment
			</button>
		</main>
	);
}
