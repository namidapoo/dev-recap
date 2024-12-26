import { graphql } from "@octokit/graphql";

type ContributionDay = {
	date: string;
	contributionCount: number;
};

type WeeklyContribution = {
	date: string;
	contributionCount: number;
};

type Repository = {
	language: string | null;
	stargazerCount: number;
};

type GitHubStatsQueryResponse = {
	user: {
		contributionsCollection: {
			contributionCalendar: {
				totalContributions: number;
				weeks: {
					contributionDays: ContributionDay[];
				}[];
			};
		};
		repositories: {
			nodes: {
				stargazerCount: number;
				primaryLanguage: {
					name: string;
				} | null;
			}[];
		};
	};
};

type Stats = {
	totalContributions: number;
	weeklyContributions: WeeklyContribution[];
	repositories: Repository[];
};

export const fetchGitHubStats = async ({
	token,
	login,
}: { token: string; login: string }): Promise<Stats> => {
	if (!login) {
		throw new Error("GitHub username (login) is required");
	}

	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${token}`,
		},
	});

	const query = `
		query ($login: String!) {
		user(login: $login) {
			contributionsCollection(from: "2024-01-01T00:00:00Z", to: "2024-12-31T23:59:59Z") {
			contributionCalendar {
				totalContributions
				weeks {
				contributionDays {
					date
					contributionCount
				}
				}
			}
			}
			repositories(first: 100, orderBy: { field: STARGAZERS, direction: DESC }) {
			nodes {
				stargazerCount
				primaryLanguage {
				name
				}
			}
			}
		}
		}
	`;

	const { user } = await graphqlWithAuth<GitHubStatsQueryResponse>({
		query,
		login,
	});

	const totalContributions =
		user.contributionsCollection.contributionCalendar.totalContributions;

	const weeklyContributions =
		user.contributionsCollection.contributionCalendar.weeks
			.flatMap((week) => week.contributionDays)
			.map((day) => ({
				date: day.date,
				contributionCount: day.contributionCount,
			}));

	const repositories = user.repositories.nodes.map((repo) => ({
		language: repo.primaryLanguage ? repo.primaryLanguage.name : null,
		stargazerCount: repo.stargazerCount,
	}));

	return {
		totalContributions,
		weeklyContributions,
		repositories,
	};
};
