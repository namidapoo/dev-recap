import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import GitHub from "@/public/github-mark-white.svg";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
	const session = await auth();
	if (!session?.user) return null;

	console.log(session);

	return (
		<div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-pink-300 to-blue-300 p-4">
			<div className="w-full max-w-md space-y-8 text-center">
				<h1 className="font-bold text-4xl text-blue-600 lg:text-5xl">
					Dev Recap 2024
				</h1>

				<div className="space-y-3">
					<p className="font-semibold text-2xl">Hi, @{session.user.login} !</p>
					<p className="text-base text-gray-600 lg:text-lg">
						1年間おつかれさまでした。
					</p>
					<p className="text-base text-gray-600 lg:text-lg">
						あなたの1年間を振り返りましょう🥳
					</p>
				</div>

				<Button asChild size="lg" className="mx-auto w-full max-w-xs py-6">
					<Link
						href="/recap"
						className="flex items-center justify-center gap-4 text-base"
					>
						<Image src={GitHub} alt="GitHub" width={20} height={20} />
						振り返りを見る
					</Link>
				</Button>
			</div>
		</div>
	);
}
