"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	username: z.string().min(1, "ユーザー名は必須です。"),
});

export const ProfileForm: FC = () => {
	const { push } = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
		mode: "onBlur",
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		push(`/recap/${values.username}`);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 w-full max-w-xs mx-auto pt-4"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="text-left">
							<FormControl className="py-6 text-lg">
								<Input
									placeholder="ユーザー名を入力してください。"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="mx-auto w-full max-w-xs py-6 text-lg">
					振り返りを見る
				</Button>
			</form>
		</Form>
	);
};
