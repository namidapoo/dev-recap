import { ContributionGrass } from "@/app/recap/components/grass";
import type { Stats } from "@/app/recap/fetchGitHubStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import {
	GitCommitHorizontal,
	GitPullRequestCreate,
	GitPullRequestCreateArrow,
	SquareKanban,
	UsersRound,
} from "lucide-react";
import type { FC } from "react";
import { calculateChangeRate } from "./calculate-change-rate";
import { LanguagesUsageGraph } from "./graph/languages";
import { MonthlyContributionsGraph } from "./graph/monthly";
import { WeeklyContributionsGraph } from "./graph/weekly";
import { ReposContributions } from "./repos-contributions";

type Props = {
	data: Stats;
};

export const OverView: FC<Props> = async ({ data }) => {
	const session = await auth();
	if (!session) return null;

	return (
		<div className="space-y-4 pb-4">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12 xl:justify-center 2xl:gap-12">
				<Card className="relative">
					<Avatar className="h-16 w-16 border absolute top-1/2 right-6 transform -translate-y-1/2">
						<AvatarImage
							src={session.user?.image ?? ""}
							alt={session.user?.login ?? ""}
						/>
						<AvatarFallback>{session.user?.login}</AvatarFallback>
					</Avatar>
					<CardHeader className="pr-24 pb-2">
						<CardTitle className="text-xl truncate">
							<a
								href={`https://github.com/${session.user.login}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								{session.user.login}
							</a>
							<p className="text-xs text-muted-foreground truncate font-normal">
								Joined on{" "}
								{format(new Date(data.userProfile.joinedDate), "MMMM dd, yyyy")}
							</p>
						</CardTitle>
					</CardHeader>
					<CardContent className="pr-24 space-y-1">
						<div className="text-sm text-muted-foreground font-bold italic truncate">
							{data.userProfile.bio ?? ""}
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
							<UsersRound className="h-4 w-4" />
							<b>{data.userProfile.followersCount.toLocaleString()}</b>{" "}
							followers ·{" "}
							<b>{data.userProfile.followingCount.toLocaleString()}</b>{" "}
							following
						</div>
					</CardContent>
				</Card>

				<div className="my-auto">
					<div className="pt-2">
						<ContributionGrass
							totalContributions={data.totalContributions}
							weeklyContributions={data.weeklyContributions}
						/>
					</div>
				</div>
			</div>
			<div className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-bold text-blue-700">
								総コミット
							</CardTitle>
							<GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{data.totalCommitCount.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								前年と比較して
								<b>
									{calculateChangeRate(
										data.previousYearStats.totalCommitCount,
										data.totalCommitCount,
									)}
								</b>
								% 増加しました。
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-bold text-blue-700">
								完了したIssue
							</CardTitle>
							<SquareKanban className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.closedIssuesAssigned.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								前年と比較して
								<b>
									{calculateChangeRate(
										data.previousYearStats.closedIssuesAssignedCount,
										data.closedIssuesAssigned,
									)}
								</b>
								% 増加しました。
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-bold text-blue-700">
								作成したPR
							</CardTitle>
							<GitPullRequestCreateArrow className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.openedPullRequests.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								前年と比較して
								<b>
									{calculateChangeRate(
										data.previousYearStats.openedPullRequests,
										data.openedPullRequests,
									)}
								</b>
								% 増加しました。
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-bold text-blue-700">
								レビューしたPR
							</CardTitle>
							<GitPullRequestCreate className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{data.reviewedPullRequests.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">
								前年と比較して
								<b>
									{calculateChangeRate(
										data.previousYearStats.reviewedPullRequests,
										data.reviewedPullRequests,
									)}
								</b>
								% 増加しました。
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
					<div className="col-span-4 order-1 md:order-1">
						<MonthlyContributionsGraph
							monthlyData={data.monthlyContributions}
						/>
					</div>
					<Card className="col-span-4 md:col-span-3 order-3 md:order-2">
						<CardHeader>
							<CardTitle>リポジトリごとの統計</CardTitle>
							<CardDescription>
								{data.repositoriesByCommitCount.length === 0
									? "データがありません。"
									: `あなたが最もコミットしたリポジトリは{" "}
								<b>${data.repositoriesByCommitCount[0].nameWithOwner}</b> です。`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ReposContributions data={data.repositoriesByCommitCount} />
						</CardContent>
					</Card>
					<div className="col-span-4 order-2 md:order-3">
						<WeeklyContributionsGraph
							dayOfWeekData={data.averageContributionsByDayOfWeek}
						/>
					</div>
					<div className="col-span-4 md:col-span-3 order-4 md:order-4">
						<LanguagesUsageGraph data={data.languagesByCommitCount} />
					</div>
				</div>
			</div>
		</div>
	);
};
