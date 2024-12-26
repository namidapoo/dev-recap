import { auth } from "@/lib/auth";
import { fetchGitHubStats } from "./fetchGitHubStats";

export default async function Page() {
	const session = await auth();
	if (!session?.user) return null;
	const token = process.env.GITHUB_TOKEN ?? session.accessToken;

	const data = await fetchGitHubStats({
		token,
		login: session.user.login,
	});

	return (
		<div className="min-h-dvh py-4">
			<h1 className="text-center">Contributions for @{session.user.login}</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
