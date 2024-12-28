import { auth } from "@/lib/auth";
import { OverView } from "./components/overview";
import { fetchGitHubStats } from "./fetchGitHubStats";

export const runtime = "edge";

export default async function page() {
	const session = await auth();
	if (!session?.user) return null;
	const token = process.env.GITHUB_TOKEN ?? session.accessToken;

	const data = await fetchGitHubStats({
		token,
		login: session.user.login,
	});

	return <OverView data={data} />;
}
