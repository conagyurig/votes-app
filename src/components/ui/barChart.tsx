"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function BarChartComponent({ dates }: BarChartProps) {
  const chartData = dates.map((date, index) => ({
    date: date.date,
    votes: date.votes,
    fill: `hsl(var(--chart-${index + 1}))`,
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
      <CardHeader>
        <CardTitle>Best days for you</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="votes"
              strokeWidth={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none"></div>
      </CardFooter>
    </Card>
  );
}
