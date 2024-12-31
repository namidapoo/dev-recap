import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import GitHubWhite from "@/public/github-mark-white.png";
import GitHubBlack from "@/public/github-mark.png";
import Image from "next/image";
import Link from "next/link";
import { ProfileForm } from "./profile-form";

export const runtime = "edge";

export default async function Home() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full pt-24 px-4 text-accent-foreground md:items-center justify-items-center">
			<div className="col-span-1 w-full max-w-md text-center space-y-2">
				<div className="space-y-8">
					<h1 className="font-bold text-2xl text-blue-600 lg:text-5xl">
						Dev Recap 2024
					</h1>
					<div className="space-y-2">
						<p className="text-base lg:text-lg">今年もおつかれさまでした。</p>
						<p className="text-base lg:text-lg">
							あなたの1年間を振り返りましょう🥳
						</p>
					</div>
				</div>

				<ProfileForm />
				<form
					action={async () => {
						"use server";
						await signIn("github");
					}}
					className="w-full max-w-xs mx-auto space-y-2"
				>
					<p className="text-lg">or</p>
					<Button size="lg" className="mx-auto w-full max-w-xs py-6 text-lg">
						<Image
							src={GitHubWhite}
							alt="GitHub"
							width={24}
							height={24}
							className="dark:hidden"
							priority
						/>
						<Image
							src={GitHubBlack}
							alt="GitHub"
							width={24}
							height={24}
							className="hidden dark:block"
							priority
						/>
						GitHubでログイン
					</Button>
				</form>
			</div>

			<div className="hidden md:block col-span-2">
				<Image
					src="/overview.png"
					alt="Overview"
					width={700}
					height={800}
					className="w-full h-auto mx-auto rounded-md"
					priority
				/>
			</div>
		</div>
	);
}
