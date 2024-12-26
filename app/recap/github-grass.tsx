import type { FC } from "react";

type Props = {
	weeklyContributions: { date: string; contributionCount: number }[];
};

// 芝生(草)を描画するためのコンポーネント
export const GitHubGrass: FC<Props> = ({ weeklyContributions }) => {
	// 7日ずつまとめて週ごとに分割し、日曜が先頭になるように並べ替え
	const weeks = chunkByWeek(weeklyContributions);

	return (
		<div className="flex gap-1">
			{weeks.map((daysInWeek, weekIndex) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={weekIndex}
					className="space-y-1"
				>
					{daysInWeek.map((day, dayIndex) => {
						const color = getContributionColor(day.contributionCount);
						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={dayIndex}
								title={`${day.date}: ${day.contributionCount} contributions`}
								className="w-3 h-3 rounded-[2px]"
								style={{ backgroundColor: color }}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
};

const contributionColors = [
	{ min: 0, max: 0, color: "#ebedf0" },
	{ min: 1, max: 11, color: "#9be9a8" },
	{ min: 12, max: 22, color: "#40c463" },
	{ min: 23, max: 34, color: "#30a14e" },
	{ min: 35, max: Number.POSITIVE_INFINITY, color: "#216e39" },
];

const getContributionColor = (count: number) => {
	const color = contributionColors.find(
		({ min, max }) => count >= min && count <= max,
	);
	return color ? color.color : "#ebedf0";
};

/**
 * 連続した日付配列を「日曜始まり」に揃えてから、7日(1週間)ずつに区切る関数
 * ・最初の日の曜日を取得し、もし日曜でなければダミー要素を先頭に追加
 * ・7日ごとにチャンク
 */
const chunkByWeek = (
	contributions: { date: string; contributionCount: number }[],
) => {
	// 1. 日付昇順にソート（念のため）
	const sorted = [...contributions].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	// 2. 先頭日の曜日を取得（0=日, 1=月, ... 6=土）
	const firstDay = new Date(sorted[0].date).getDay();

	// 3. 先頭日が日曜日でなければ、日曜スタートに合わせるためのダミーを追加
	const placeholders = [];
	for (let i = 0; i < firstDay; i++) {
		placeholders.push({
			date: "", // 日付なし
			contributionCount: 0,
		});
	}

	// 4. ダミーを先頭に連結
	const aligned = [...placeholders, ...sorted];

	// 5. 7日ごとに分割
	const chunked: { date: string; contributionCount: number }[][] = [];
	for (let i = 0; i < aligned.length; i += 7) {
		chunked.push(aligned.slice(i, i + 7));
	}

	return chunked;
};
