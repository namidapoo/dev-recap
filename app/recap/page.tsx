import { auth } from "@/lib/auth";
import { fetchGitHubStats } from "./fetchGitHubStats";
import { GitHubGrass } from "./github-grass";

export const runtime = "edge";

export default async function Page() {
	const session = await auth();
	if (!session?.user) return null;
	const token = process.env.GITHUB_TOKEN ?? session.accessToken;

	const data = await fetchGitHubStats({
		token,
		login: session.user.login,
	});

	return (
		<div className="min-h-dvh py-4 w-5/6 max-w-[844px] mx-auto">
			<h1 className="text-center">Contributions for @{session.user.login}</h1>
			<div className="py-8">
				<GitHubGrass weeklyContributions={data.weeklyContributions} />
			</div>
		</div>
	);
}
