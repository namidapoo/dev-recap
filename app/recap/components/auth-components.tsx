import { Button } from "@/components/ui/button";
import type { ComponentPropsWithRef, FC } from "react";
import { handleSignIn, handleSignOut } from "./action";

type Props = { provider?: string } & ComponentPropsWithRef<typeof Button>;

export const SignIn: FC<Props> = ({ provider, ...props }) => {
	return (
		<form action={() => handleSignIn(provider)}>
			<Button {...props}>サインイン</Button>
		</form>
	);
};

export const SignOut: FC<Props> = ({ provider, ...props }) => {
	return (
		<form className="w-full" action={() => handleSignOut(provider)}>
			<Button variant="ghost" className="w-full p-0" {...props}>
				ログアウト
			</Button>
		</form>
	);
};
