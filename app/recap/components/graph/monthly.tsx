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
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { type FC, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
	monthly: {
		label: "Monthly",
	},
};

type Props = {
	monthlyData: Stats["monthlyContributions"];
};

export const MonthlyContributionsGraph: FC<Props> = ({ monthlyData }) => {
	const chartData = useMemo(() => {
		return monthlyData.map((item) => ({
			x: item.month,
			y: item.contributionCount,
		}));
	}, [monthlyData]);

	const maxMonthData = useMemo(() => {
		if (monthlyData.length === 0) {
			return { month: "-", contributionCount: 0 };
		}
		return monthlyData.reduce((acc, curr) =>
			curr.contributionCount > acc.contributionCount ? curr : acc,
		);
	}, [monthlyData]);

	const dynamicConfig = useMemo(() => {
		return { monthly: chartConfig.monthly };
	}, []);

	return (
		<Card className="h-full flex flex-col justify-center">
			<CardHeader className="border-b p-0">
				<div className="flex flex-col justify-center gap-1 px-6 py-5">
					<CardTitle>Monthly Contributions</CardTitle>
					<CardDescription>
						{maxMonthData.month}: {maxMonthData.contributionCount} Contributions
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={dynamicConfig}
					className="aspect-auto h-[280px] w-full"
				>
					<BarChart
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="x"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
						/>
						<YAxis tickLine={false} axisLine={false} tickMargin={8} />
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									labelFormatter={(label) => String(label)}
									formatter={(value) => [
										<span key="value" className="font-bold">
											{value}
										</span>,
										"Contributions",
									]}
								/>
							}
						/>
						<Bar dataKey="y" radius={2} fill="hsl(var(--chart-1))" />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
