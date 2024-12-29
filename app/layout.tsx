import type { Metadata } from "next";
import "./globals.css";
import type { FC } from "react";
import { Header } from "./recap/components/header/header";
import { ThemeProvider } from "./recap/components/theme-toggle/theme-provider";

export const metadata: Metadata = {
	title: "Dev Recap 2024",
	description: "A recap of the latest in web development",
};

type Props = {
	children: React.ReactNode;
};

const RootLayout: FC<Readonly<Props>> = ({ children }) => {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className="antialiased text-gray-900">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex flex-col h-dvh">
						<Header />
						<div className="flex-grow p-4 md:px-6 overflow-auto">
							{children}
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
