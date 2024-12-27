"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SkipForward } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

type Props = {
	weeklyContributions: { date: string; contributionCount: number }[];
};

export const GitHubGrass: FC<Props> = ({ weeklyContributions }) => {
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
		<div className="w-full space-y-4">
			<div className="flex justify-center overflow-x-auto gap-1">
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

							// スキップOFFかつアニメーションがまだ終わっていない場合のみ、animation適用
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

							return (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={dayIndex}
									className={cn(
										isFinal ? classNameWhenSkipped : classNameWhenNotSkipped,
									)}
									style={isFinal ? styleWhenDone : styleWhenAnimating}
									title={`${day.date}: ${day.contributionCount} contributions`}
									// 最後のセルだけアニメーション終了をキャッチして hasAnimationEnded = true にする
									onAnimationEnd={
										// スキップOFFかつまだアニメが終わっていなくて、かつ最後のセル
										!skipAnimation && !hasAnimationEnded && isLastCell
											? handleLastCellAnimationEnd
											: undefined
									}
								/>
							);
						})}
					</div>
				))}
			</div>
			<div className="flex gap-2 items-center justify-end">
				<ActivityLevelIndicator />
				<Button
					variant="outline"
					size="icon"
					// アニメが終了 or スキップ済み の場合にdisabled
					disabled={skipAnimation || hasAnimationEnded}
					onClick={() => setSkipAnimation(true)}
					className="h-7 w-7"
				>
					<SkipForward className="text-gray-500" />
				</Button>
			</div>
		</div>
	);
};

/**
 * アクティビティレベルのインジケータ
 */
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
