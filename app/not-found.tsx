import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
	return (
		<div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
			<div className="space-y-4 text-center">
				<h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">
					404
				</h1>
				<Separator className="mx-auto w-20" />
				<p className="text-xl">This page could not be found.</p>
				<Button asChild>
					<Link href="/">Go back home</Link>
				</Button>
			</div>
		</div>
	);
}
