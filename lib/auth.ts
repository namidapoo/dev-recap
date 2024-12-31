import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		GitHub({
			authorization: {
				param: {
					scope: "repo",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, profile, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			if (profile) {
				const { login } = profile;
				token.user = { ...token.user, login };
			}
			return token;
		},
		async session({ session, token }) {
			const { login } = token.user;
			session.user = { ...session.user, login };
			session.accessToken = token.accessToken;
			return session;
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnRecap = nextUrl.pathname.startsWith("/recap");
			if (isLoggedIn && !isOnRecap) {
				return Response.redirect(new URL(`/recap/${auth.user.login}`, nextUrl));
			}
			return true;
		},
	},
});
declare module "next-auth" {
	interface Session {
		user: {
			login: string;
		} & DefaultSession["user"];
		accessToken: string;
	}
	interface User {
		login: string;
	}
	interface Profile {
		login: string;
	}
	interface Account {
		access_token: string;
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		user: {
			login: string;
		};
		accessToken: string;
	}
}
