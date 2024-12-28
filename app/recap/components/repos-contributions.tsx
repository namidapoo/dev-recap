import type { Stats } from "@/app/recap/fetchGitHubStats";
import { MapPinHouse } from "lucide-react";
import type { FC } from "react";

type Props = {
	data: Stats["repositoriesByCommitCount"];
};

export const ReposContributions: FC<Props> = ({ data }) => {
	return (
		<div className="space-y-8">
			{data.map((repos) => {
				const [owner, repoName] = repos.nameWithOwner.split("/");

				return (
					<div key={repos.nameWithOwner} className="flex items-center">
						<MapPinHouse className="h-6 w-6" />
						<div className="ml-4 space-y-1">
							<a
								href={`https://github.com/${repos.nameWithOwner}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								<p className="text-sm font-semibold leading-none">{repoName}</p>
							</a>
							<a
								href={`https://github.com/${owner}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								<p className="text-sm text-muted-foreground">{owner}</p>
							</a>
						</div>
						<div className="ml-auto font-medium">
							+{repos.commitCount.toLocaleString()}
						</div>
					</div>
				);
			})}
		</div>
	);
};
