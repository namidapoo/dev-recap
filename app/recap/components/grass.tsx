"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLast } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function getDaySuffix(day: number) {
	if (day >= 11 && day <= 13) {
		return "th";
	}
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

function formatDateToPrettyString(dateString: string): string {
	const dateObj = new Date(dateString);
	const month = MONTH_NAMES[dateObj.getMonth()];
	const day = dateObj.getDate();
	const suffix = getDaySuffix(day);
	return `${month} ${day}${suffix}`;
}

type Props = {
	weeklyContributions: { date: string; contributionCount: number }[];
	totalContributions: number;
};

export const ContributionGrass: FC<Props> = ({
	weeklyContributions,
	totalContributions,
}) => {
	// アニメーションをスキップするか
	const [skipAnimation, setSkipAnimation] = useState<boolean>(false);
	// 最後のセルのアニメーションが終了したか
	const [hasAnimationEnded, setHasAnimationEnded] = useState<boolean>(false);

	const weeks = chunkByWeek(weeklyContributions);

	// 「最後のセルの onAnimationEnd」ハンドラ
	const handleLastCellAnimationEnd = () => {
		setHasAnimationEnded(true);
	};

	return (
		<div className="w-full space-y-1">
			<TooltipProvider>
				<div className="flex justify-start overflow-x-auto gap-1 pb-2">
					{weeks.map((daysInWeek, weekIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={weekIndex} className="space-y-1">
							{daysInWeek.map((day, dayIndex) => {
								const finalColor = getContributionColor(day.contributionCount);

								// セルごとの遅延
								const cellDelay = (weekIndex * 7 + dayIndex) * 0.03;

								// 最後のセルかどうかを判定
								const isLastCell =
									weekIndex === weeks.length - 1 &&
									dayIndex === daysInWeek.length - 1;

								// スキップON or アニメーション終了後は最終色を即時表示
								const isFinal = skipAnimation || hasAnimationEnded;

								// スキップOFFかつアニメがまだ終わっていない場合のみアニメ適用
								const classNameWhenNotSkipped =
									"w-3 h-3 rounded-[2px] animate-fadeInBg";
								const classNameWhenSkipped = "w-3 h-3 rounded-[2px]";

								// スタイル切り替え
								const styleWhenAnimating = {
									["--final-bg" as string]: finalColor,
									animationDelay: `${cellDelay}s`,
								};
								const styleWhenDone = {
									backgroundColor: finalColor,
								};

								const isDummyCell = !day.date;

								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Tooltip key={dayIndex} disableHoverableContent={isDummyCell}>
										<TooltipTrigger asChild>
											<div
												className={cn(
													isFinal
														? classNameWhenSkipped
														: classNameWhenNotSkipped,
												)}
												style={isFinal ? styleWhenDone : styleWhenAnimating}
												// 最後のセルだけアニメーション終了をキャッチする
												onAnimationEnd={
													!skipAnimation && !hasAnimationEnded && isLastCell
														? handleLastCellAnimationEnd
														: undefined
												}
											/>
										</TooltipTrigger>
										{!isDummyCell && (
											<TooltipContent>
												<p className="font-semibold">
													{day.contributionCount === 0
														? `No contributions on ${formatDateToPrettyString(day.date)}.`
														: `${day.contributionCount} contributions on ${formatDateToPrettyString(day.date)}.`}
												</p>
											</TooltipContent>
										)}
									</Tooltip>
								);
							})}
						</div>
					))}
				</div>
			</TooltipProvider>

			<div className="flex items-end justify-between">
				<p className="font-bold">{totalContributions} contributions</p>
				<div className="flex gap-2 items-center">
					<ActivityLevelIndicator />
					<Button
						variant="outline"
						size="icon"
						disabled={skipAnimation || hasAnimationEnded}
						onClick={() => setSkipAnimation(true)}
						className="h-7 w-7"
					>
						<ChevronLast className="text-muted-foreground" />
					</Button>
				</div>
			</div>
		</div>
	);
};

const ActivityLevelIndicator = () => {
	return (
		<div className="flex gap-1 items-center text-sm text-muted-foreground">
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
			date: "",
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
