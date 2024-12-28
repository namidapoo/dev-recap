import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import GitHubWhite from "@/public/github-mark-white.png";
import GitHubBlack from "@/public/github-mark.png";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
	const session = await auth();
	if (!session?.user) return null;

	console.log(session);

	return (
		<div className="h-full flex justify-center pt-24 px-4 text-accent-foreground lg:items-center">
			<div className="w-full max-w-md space-y-8 text-center">
				<h1 className="font-bold text-2xl text-blue-600 lg:text-5xl">
					Dev Recap 2024
				</h1>
				<div className="space-y-3">
					{session.user.image && (
						<Image
							src={session.user.image}
							alt={session.user.login}
							width={100}
							height={100}
							className="rounded-full mx-auto shadow"
							priority
						/>
					)}
					<p className="font-semibold text-2xl">Hi, @{session.user.login} !</p>
					<p className="text-base lg:text-lg">今年もおつかれさまでした。</p>
					<p className="text-base lg:text-lg">
						あなたの1年間を振り返りましょう🥳
					</p>
				</div>

				<Button asChild size="lg" className="mx-auto w-full max-w-xs py-6">
					<Link
						href="/recap"
						className="flex items-center justify-center gap-4 text-base"
					>
						<Image
							src={GitHubWhite}
							alt="GitHub"
							width={20}
							height={20}
							className="dark:hidden"
						/>
						<Image
							src={GitHubBlack}
							alt="GitHub"
							width={20}
							height={20}
							className="hidden dark:block"
						/>
						振り返りを見る
					</Link>
				</Button>
			</div>
		</div>
	);
}
