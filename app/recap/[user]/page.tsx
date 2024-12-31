import { auth } from "@/lib/auth";
import { OverView } from "../components/overview";
import { fetchGitHubStats } from "../fetchGitHubStats";

export const runtime = "edge";

export default async function Page({
	params,
}: {
	params: Promise<{ user: string }>;
}) {
	const { user } = await params;
	const session = await auth();
	// ログインしてない場合は環境変数からトークンを取得
	if (!process.env.GITHUB_TOKEN) {
		throw new Error("GITHUB_TOKEN is not defined");
	}
	const token = session?.accessToken ?? process.env.GITHUB_TOKEN;
	const data = await fetchGitHubStats({
		token,
		login: user,
	});

	return <OverView user={user} data={data} />;
}
