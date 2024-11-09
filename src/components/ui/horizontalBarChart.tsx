"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface BarChartProps {
  dates: BarChartOption[];
}

export interface BarChartOption {
  date: string;
  votes: number;
}

export interface BarChartOptionWithColour {
  date: string;
  votes: number;
  colour: number;
}

export function HorizontalBarChartComponent({ dates }: BarChartProps) {
  const chartWithColour: BarChartOptionWithColour[] = normaliseColours(dates);
  const chartData = chartWithColour.map((date) => ({
    date: date.date,
    votes: date.votes,
    fill: `hsl(var(--chart-${date.colour}))`,
  }));

  const chartConfig = dates.reduce((config, date, index) => {
    const colorVar = `--chart-${index + 1}`;
    config[date.date.toLowerCase()] = {
      label: date.date,
      color: `hsl(var(${colorVar}))`,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader className="items-center pb-5">
        <CardTitle>When you are free</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            compact={false}
            margin={{
              left: 0,
            }}
          >
            <XAxis type="number" dataKey="votes" hide />
            <YAxis
              height={100}
              dataKey="date"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="votes" fill="black" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function normaliseColours(barChartProps: BarChartOption[]) {
  const n = barChartProps.length;
  let data = barChartProps;
  let flag = false;
  while (!flag) {
    let swapped = false;
    for (let i = 1; i < n; i++) {
      if (data[i - 1].votes < data[i].votes) {
        let x = data[i];
        data[i] = data[i - 1];
        data[i - 1] = x;
        swapped = true;
      }
    }
    if (!swapped) {
      flag = true;
    }
  }

  const maxVote = data[0].votes;
  let result = [];

  for (let j = 0; j < n; j++) {
    const colour =
      5 - (maxVote - data[j].votes) > 0 ? 5 - (maxVote - data[j].votes) : 1;
    const obj = { date: data[j].date, votes: data[j].votes, colour: colour };
    result.push(obj);
  }
  return result;
}
