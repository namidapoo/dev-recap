import "server-only";
import { graphql } from "@octokit/graphql";

/**
 * 日ごとの貢献数
 */
type ContributionDay = {
	date: string;
	contributionCount: number;
};

/**
 * 週ごとの貢献数
 */
type WeeklyContribution = {
	date: string;
	contributionCount: number;
};

/**
 * リポジトリ情報
 */
type Repository = {
	language: string | null;
	stargazerCount: number;
	nameWithOwner: string;
	createdAt: string;
};

/**
 * リポジトリ別コミット数集計用
 */
type RepositoryCommitStats = {
	nameWithOwner: string;
	commitCount: number;
};

/**
 * 言語別コミット数集計用
 */
type LanguageCommitStats = {
	language: string;
	commitCount: number;
};

/**
 * GraphQL から受け取るレスポンス型 (新規フィールドを含む)
 */
type GitHubStatsQueryResponse = {
	user: {
		createdAt: string;
		bio: string | null;
		avatarUrl: string;
		followers: {
			totalCount: number;
		};
		following: {
			totalCount: number;
		};

		contributionsCollection: {
			contributionCalendar: {
				totalContributions: number;
				weeks: {
					contributionDays: ContributionDay[];
				}[];
			};
			commitContributionsByRepository: Array<{
				repository: {
					nameWithOwner: string;
				};
				contributions: {
					totalCount: number;
				};
			}>;
			pullRequestContributions: {
				totalCount: number;
			};
			pullRequestReviewContributions: {
				totalCount: number;
			};
		};
		repositories: {
			nodes: Array<{
				nameWithOwner: string;
				stargazerCount: number;
				primaryLanguage: {
					name: string;
				} | null;
				createdAt: string;
			}>;
		};
	};
	closedIssuesAssigned: {
		issueCount: number;
	};
	reviewedPRs: {
		issueCount: number;
	};
};

export type Stats = {
	userProfile: {
		joinedDate: string; // 登録日時
		bio: string | null; // bio
		avatarUrl: string; // アバター画像URL
		followingCount: number; // フォロー数
		followersCount: number; // フォロワー数
	};

	totalContributions: number; // 年間の総貢献数
	weeklyContributions: WeeklyContribution[]; // 日別(週単位配列経由)の貢献数
	repositories: Repository[]; // リポジトリ一覧

	repositoriesByCommitCount: RepositoryCommitStats[]; // リポジトリ別のコミット数ランキング

	languagesByCommitCount: LanguageCommitStats[]; // 言語別のコミット数ランキング

	totalCommitCount: number; // 総コミット数
	openedPullRequests: number; // 自分がオープンした PRの数
	reviewedPullRequests: number; // 自分がレビューした PRの数
	closedIssuesAssigned: number; // 自分がアサインされてクローズしたISSUE 数
	newlyCreatedRepositoryCount: number; // 2024年内に作成したリポジトリ数

	monthlyContributions: {
		month: string; // "1月", "2月", ...
		contributionCount: number; // 月ごとの貢献数
	}[];

	averageContributionsByDayOfWeek: {
		dayOfWeek: string; // "日曜日", "月曜日", ...
		averageContributions: number; // 曜日ごとの平均貢献数
	}[];

	// 前年比較用のデータ
	previousYearStats: {
		totalCommitCount: number; // 前年の総コミット数
		openedPullRequests: number; // 前年のオープンしたPR数
		reviewedPullRequests: number; // 前年のレビューしたPR数
		closedIssuesAssignedCount: number; // 前年のアサインされてクローズしたISSUE数
	};
};

export const fetchGitHubStats = async ({
	token,
	login,
}: {
	token: string;
	login: string;
}): Promise<Stats> => {
	if (!login) {
		throw new Error("GitHub username (login) is required");
	}

	// 2024年の開始日時・終了日時
	const from = "2024-01-01T00:00:00Z";
	const to = "2024-12-31T23:59:59Z";

	// 2023年の開始日時・終了日時
	const fromPrevYear = "2023-01-01T00:00:00Z";
	const toPrevYear = "2023-12-31T23:59:59Z";

	// graphqlクライアントの作成
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${token}`,
		},
	});

	// 2024年の検索クエリ
	const closedIssuesByAssigneeQueryThisYear = `assignee:${login} is:issue is:closed closed:2024-01-01..2024-12-31`;
	const reviewedPRsSearchQueryThisYear = `reviewed-by:${login} is:pr updated:2024-01-01..2024-12-31`;

	// 2023年の検索クエリ
	const closedIssuesByAssigneeQueryPrevYear = `assignee:${login} is:issue is:closed closed:2023-01-01..2023-12-31`;
	const reviewedPRsSearchQueryPrevYear = `reviewed-by:${login} is:pr updated:2023-01-01..2023-12-31`;

	const query = `
    query (
      $login: String!,
      $from: DateTime!,
      $to: DateTime!,
      $closedIssuesByAssigneeQuery: String!,
      $reviewedPRsSearchQuery: String!
    ) {
      user(login: $login) {
        createdAt
        bio
		avatarUrl
        followers {
          totalCount
        }
        following {
          totalCount
        }
        
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
            }
            contributions {
              totalCount
            }
          }
          pullRequestContributions(first: 1) {
            totalCount
          }
          pullRequestReviewContributions(first: 1) {
            totalCount
          }
        }
        repositories(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            nameWithOwner
            stargazerCount
            primaryLanguage {
              name
            }
            createdAt
          }
        }
      }
      closedIssuesAssigned: search(
        query: $closedIssuesByAssigneeQuery
        type: ISSUE
        first: 1
      ) {
        issueCount
      }
      reviewedPRs: search(
        query: $reviewedPRsSearchQuery
        type: ISSUE
        first: 1
      ) {
        issueCount
      }
    }
  `;

	// 2024年のデータ取得
	const { user, closedIssuesAssigned, reviewedPRs } =
		await graphqlWithAuth<GitHubStatsQueryResponse>({
			query,
			login,
			from,
			to,
			closedIssuesByAssigneeQuery: closedIssuesByAssigneeQueryThisYear,
			reviewedPRsSearchQuery: reviewedPRsSearchQueryThisYear,
		});

	// 2023年のデータ取得
	const {
		user: userPrevYear,
		closedIssuesAssigned: closedIssuesAssignedPrevYear,
		reviewedPRs: reviewedPRsPrevYear,
	} = await graphqlWithAuth<GitHubStatsQueryResponse>({
		query,
		login,
		from: fromPrevYear,
		to: toPrevYear,
		closedIssuesByAssigneeQuery: closedIssuesByAssigneeQueryPrevYear,
		reviewedPRsSearchQuery: reviewedPRsSearchQueryPrevYear,
	});

	// 2023年のデータから前年の統計を取得
	const prevYearCommitContributions =
		userPrevYear.contributionsCollection.commitContributionsByRepository;
	// 前年の総コミット数
	const previousYearTotalCommitCount = prevYearCommitContributions.reduce(
		(sum, item) => sum + item.contributions.totalCount,
		0,
	);
	// 2023年のオープンしたPR数
	const previousYearOpenedPullRequests =
		userPrevYear.contributionsCollection.pullRequestContributions.totalCount;
	// 2023年のレビューしたPR数
	const previousYearReviewedPullRequests = reviewedPRsPrevYear.issueCount;
	// 2023年のアサインされてクローズしたISSUE数
	const previousYearClosedIssuesAssignedCount =
		closedIssuesAssignedPrevYear.issueCount;

	// 総貢献数
	const totalContributions =
		user.contributionsCollection.contributionCalendar.totalContributions;
	// 日別の貢献数を配列として取得
	const dailyContributions =
		user.contributionsCollection.contributionCalendar.weeks
			.flatMap((week) => week.contributionDays)
			.map((day) => ({
				date: day.date,
				contributionCount: day.contributionCount,
			}));
	// 週ごとの貢献数として扱う
	const weeklyContributions = dailyContributions;

	// リポジトリ一覧
	const repositories = user.repositories.nodes.map((repo) => ({
		nameWithOwner: repo.nameWithOwner,
		language: repo.primaryLanguage ? repo.primaryLanguage.name : null,
		stargazerCount: repo.stargazerCount,
		createdAt: repo.createdAt,
	}));
	// リポジトリ別コミット数
	const commitContributions =
		user.contributionsCollection.commitContributionsByRepository;
	// コミット数の多いリポジトリをコミット数順でソートした配列を取得
	const repositoriesByCommitCount: RepositoryCommitStats[] = commitContributions
		.map((item) => ({
			nameWithOwner: item.repository.nameWithOwner,
			commitCount: item.contributions.totalCount,
		}))
		.sort((a, b) => b.commitCount - a.commitCount)
		.slice(0, 5);

	// 言語ごとにコミット数を集計
	// リポジトリ名 -> 言語 のマップを作成
	const repoLanguageMap = repositories.reduce<Record<string, string | null>>(
		(acc, repo) => {
			acc[repo.nameWithOwner] = repo.language;
			return acc;
		},
		{},
	);
	// 言語 -> コミット数 を集計
	const languageCommitCountMap = commitContributions.reduce<
		Record<string, number>
	>((acc, item) => {
		const repoName = item.repository.nameWithOwner;
		const language = repoLanguageMap[repoName];
		if (language) {
			acc[language] = (acc[language] || 0) + item.contributions.totalCount;
		}
		return acc;
	}, {});
	//  コミット数の多い言語をコミット数順でソートした配列を取得
	const languagesByCommitCount: LanguageCommitStats[] = Object.entries(
		languageCommitCountMap,
	)
		.map(([language, commitCount]) => ({ language, commitCount }))
		.sort((a, b) => b.commitCount - a.commitCount);

	// 総コミット数
	const totalCommitCount = commitContributions.reduce(
		(sum, item) => sum + item.contributions.totalCount,
		0,
	);

	//	自分がオープンしたPR数
	const openedPullRequests =
		user.contributionsCollection.pullRequestContributions.totalCount;

	//	自分がレビューしたPR数
	const reviewedPullRequests = reviewedPRs.issueCount;

	// 自分がアサインされていてクローズしたISSUE
	const closedIssuesAssignedCount = closedIssuesAssigned.issueCount;

	// 作成したリポジトリ数
	const newlyCreatedRepositoryCount = repositories.filter((repo) => {
		const created = new Date(repo.createdAt);
		return created >= new Date(from) && created <= new Date(to);
	}).length;

	// 月ごとの貢献数を集計
	type MonthlyStats = {
		[yearMonthKey: string]: number; // "YYYY-3" のように year + monthIndex をキーに
	};
	const monthlyStats: MonthlyStats = {};
	// 日別の貢献数を集計
	for (const day of dailyContributions) {
		const d = new Date(day.date);
		const key = `${d.getFullYear()}-${d.getMonth()}`; // 例: "2024-3"
		monthlyStats[key] = (monthlyStats[key] || 0) + day.contributionCount;
	}
	// 配列に変換
	const monthlyContributions = Object.entries(monthlyStats).map(
		([key, total]) => {
			const [_, monthIndexStr] = key.split("-");
			const idx = Number.parseInt(monthIndexStr, 10);
			return {
				// month: monthNames[idx],
				month: `${idx + 1}月`,
				contributionCount: total,
			};
		},
	);

	// 曜日ごとの平均貢献数を集計
	const dayOfWeekMap = [
		"日曜日",
		"月曜日",
		"火曜日",
		"水曜日",
		"木曜日",
		"金曜日",
		"土曜日",
	];
	type DayOfWeekStats = { total: number; count: number };
	// 曜日ごとの合計・件数を初期化
	const dayOfWeekStats: DayOfWeekStats[] = Array.from({ length: 7 }, () => ({
		total: 0,
		count: 0,
	}));
	// 曜日ごとに合計・件数を集計
	for (const day of dailyContributions) {
		const w = new Date(day.date).getDay(); // 0=日曜日, 1=月曜日, ...
		dayOfWeekStats[w].total += day.contributionCount;
		dayOfWeekStats[w].count += 1;
	}
	// 平均値を出して配列化
	const averageContributionsByDayOfWeek = dayOfWeekStats.map((stats, idx) => {
		const avg = stats.count > 0 ? stats.total / stats.count : 0;
		return {
			dayOfWeek: dayOfWeekMap[idx],
			averageContributions: Math.round(avg * 100) / 100,
		};
	});

	return {
		userProfile: {
			joinedDate: user.createdAt,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
			followingCount: user.following.totalCount,
			followersCount: user.followers.totalCount,
		},
		totalContributions,
		weeklyContributions,
		repositories,
		repositoriesByCommitCount,
		languagesByCommitCount,
		totalCommitCount,
		openedPullRequests,
		reviewedPullRequests,
		closedIssuesAssigned: closedIssuesAssignedCount,
		newlyCreatedRepositoryCount,
		monthlyContributions,
		averageContributionsByDayOfWeek,
		previousYearStats: {
			totalCommitCount: previousYearTotalCommitCount,
			openedPullRequests: previousYearOpenedPullRequests,
			reviewedPullRequests: previousYearReviewedPullRequests,
			closedIssuesAssignedCount: previousYearClosedIssuesAssignedCount,
		},
	};
};
