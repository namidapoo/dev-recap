import type { FC } from "react";

type Props = {
	weeklyContributions: { date: string; contributionCount: number }[];
};

export const GitHubGrass: FC<Props> = ({ weeklyContributions }) => {
	const weeks = chunkByWeek(weeklyContributions);

	return (
		<div className="w-full space-y-4">
			<div className="flex justify-center overflow-x-auto gap-1">
				{weeks.map((daysInWeek, weekIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={weekIndex} className="space-y-1">
						{daysInWeek.map((day, dayIndex) => {
							const finalColor = getContributionColor(day.contributionCount);

							// セルごとの遅延
							const cellDelay = (weekIndex * 7 + dayIndex) * 0.03;

							return (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={dayIndex}
									className="w-3 h-3 rounded-[2px] animate-fadeInBg"
									style={{
										["--final-bg" as string]: finalColor,
										animationDelay: `${cellDelay}s`,
									}}
									title={`${day.date}: ${day.contributionCount} contributions`}
								/>
							);
						})}
					</div>
				))}
			</div>
			<div className="flex justify-end">
				<ActivityLevelIndicator />
			</div>
		</div>
	);
};

const ActivityLevelIndicator = () => {
	return (
		<div className="flex gap-1 items-center text-sm">
			<p>Less</p>
			{contributionColors.map(({ min, max, color }) => (
				<div
					key={`${min}-${max}`}
					className="w-3 h-3 rounded-[2px]"
					style={{ backgroundColor: color }}
				/>
			))}
			<p>More</p>
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
	const colorObj = contributionColors.find(
		({ min, max }) => count >= min && count <= max,
	);
	return colorObj ? colorObj.color : "#ebedf0";
};

/**
 * 連続した日付配列を「日曜始まり」に揃えてから、7日(1週間)ずつに区切る関数
 * ・最初の日の曜日を取得し、もし日曜でなければダミー要素を先頭に追加
 * ・7日ごとにチャンク
 */
const chunkByWeek = (
	contributions: { date: string; contributionCount: number }[],
) => {
	// 1. 日付昇順にソート
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
