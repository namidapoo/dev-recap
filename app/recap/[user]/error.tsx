"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const runtime = "edge";

export default function ErrorPage() {
	return (
		<div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
			<div className="space-y-4 text-center">
				<p className="text-lg">ユーザーの情報を取得できませんでした。</p>
				<Separator className="mx-auto w-40" />
				<Button asChild size="lg">
					<Link href="/">ホームに戻る</Link>
				</Button>
			</div>
		</div>
	);
}
