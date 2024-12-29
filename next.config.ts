import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

const createConfig = async (): Promise<NextConfig> => {
	if (process.env.NODE_ENV === "development") {
		await setupDevPlatform();
	}
	const nextConfig: NextConfig = {
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "avatars.githubusercontent.com",
				},
			],
		},
	};
	return nextConfig;
};

export default createConfig();
