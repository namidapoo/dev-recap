"use client";
import { cn } from "@/lib/utils";
import GitHubWhite from "@/public/github-mark-white.png";
import GitHubBlack from "@/public/github-mark.png";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type FC } from "react";
import { ModeToggle } from "../theme-toggle/theme-toggle";
import { Breadcrumbs } from "./breadcrumbs";

export const Header: FC = () => {
	const pathname = usePathname();
	const isOnTop = pathname === "/";

	return (
		<SessionProvider>
			<header
				className={cn(
					"flex h-16 items-center justify-between sticky top-0 z-10 bg-background shadow-md dark:shadow-current px-6",
					isOnTop && "hidden",
				)}
			>
				<div className="flex items-center gap-2">
					<Breadcrumbs />
				</div>
				<div className="flex items-center gap-6">
					<Link
						href="https://github.com/namidapoo/dev-recap"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={GitHubWhite}
							alt="GitHub"
							width={20}
							height={20}
							className="hidden dark:block"
						/>
						<Image
							src={GitHubBlack}
							alt="GitHub"
							width={20}
							height={20}
							className="dark:hidden"
						/>
					</Link>
					<ModeToggle />
				</div>
			</header>
		</SessionProvider>
	);
};
