"use server";

import { signIn, signOut } from "@/lib/auth";

export async function handleSignIn(provider?: string) {
	await signIn(provider);
}

export async function handleSignOut(provider?: string) {
	await signOut({ redirectTo: "/" });
}
