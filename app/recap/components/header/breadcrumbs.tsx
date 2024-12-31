"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

export const Breadcrumbs: FC = () => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const isOnRecap = pathname.startsWith("/recap");

	return (
		<Breadcrumb>
			<BreadcrumbList className={cn(!isOnRecap && "hidden")}>
				<BreadcrumbItem>
					<BreadcrumbLink
						asChild
						className="text-lg font-extrabold text-accent-foreground"
					>
						{session?.user ? (
							<Button
								variant="link"
								className="hover:no-underline"
								onClick={() =>
									signOut({
										redirectTo: "/",
									})
								}
							>
								Dev Recap 2024
							</Button>
						) : (
							<Link href="/">Dev Recap 2024</Link>
						)}
					</BreadcrumbLink>
				</BreadcrumbItem>
				{isOnRecap && session?.user && (
					<>
						<BreadcrumbSeparator className="hidden md:block">
							<Slash />
						</BreadcrumbSeparator>
						<BreadcrumbPage className="font-semibold text-accent-foreground hidden md:block">
							{session.user.login}'s contributions
						</BreadcrumbPage>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
