"use client";
import type { Stats } from "@/app/recap/fetchGitHubStats";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import type { FC } from "react";
import { Label, Pie, PieChart } from "recharts";

type Props = {
	data: Stats["languagesByCommitCount"];
};

export const LanguagesUsageGraph: FC<Props> = ({ data }) => {
	const limitedData = useMemo(() => {
		if (data.length <= 6) {
			return data;
		}
		const mainItems = data.slice(0, 5);
		const others = data.slice(5);

		const othersCommitSum = others.reduce(
			(acc, item) => acc + item.commitCount,
			0,
		);

		return [
			...mainItems,
			{
				language: "Others",
				commitCount: othersCommitSum,
			},
		];
	}, [data]);

	const colorPalette = useMemo(
		() => [
			"hsl(var(--chart-1))",
			"hsl(var(--chart-2))",
			"hsl(var(--chart-3))",
			"hsl(var(--chart-4))",
			"hsl(var(--chart-5))",
			"hsl(var(--chart-6))",
		],
		[],
	);

	const totalCommits = useMemo(() => {
		return limitedData.reduce((acc, curr) => acc + curr.commitCount, 0);
	}, [limitedData]);

	const chartData = useMemo(() => {
		if (totalCommits === 0) {
			return limitedData.map((item, index) => ({
				language: item.language,
				share: 0,
				fill: colorPalette[index % colorPalette.length],
			}));
		}
		return limitedData.map((item, index) => ({
			language: item.language,
			share: (item.commitCount / totalCommits) * 100,
			fill: colorPalette[index % colorPalette.length],
		}));
	}, [limitedData, totalCommits, colorPalette]);

	const chartConfig = useMemo<ChartConfig>(() => {
		const dynamicLangConfig = limitedData.reduce((acc, item, index) => {
			acc[item.language] = {
				label: item.language,
				color: colorPalette[index % colorPalette.length],
			};
			return acc;
		}, {} as ChartConfig);

		return {
			visitors: {
				label: "Share",
			},
			...dynamicLangConfig,
		};
	}, [limitedData, colorPalette]);

	return (
		<Card className="flex flex-col py-[0.42rem]">
			<CardHeader className="items-start pb-0">
				<CardTitle>言語の使用率</CardTitle>
				<CardDescription>
					{limitedData.length === 0
						? "データがありません。"
						: `あなたが最も使用した言語は <b>${limitedData[0].language}</b> です。`}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[360px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="share"
							nameKey="language"
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													100
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground text-sm"
												>
													%
												</tspan>
											</text>
										);
									}
									return null;
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
