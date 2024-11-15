import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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

export interface PieChartProps {
  options: ChartOption[];
}

export interface ChartOption {
  content: string;
  votes: number;
}

export function PieChartComponent({ options }: PieChartProps) {
  const chartData = options.map((option, index) => ({
    option: option.content,
    votes: option.votes,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const chartConfig = options.reduce((config, option, index) => {
    const colorVar = `--chart-${index + 1}`;
    config[option.content.toLowerCase()] = {
      label: option.content,
      color: `hsl(var(${colorVar}))`,
    };
    return config;
  }, {} as ChartConfig);

  const maxVotes = getMax(options);

  const topOptions = options.map((option) => {
    if (option.votes == maxVotes) {
      return option;
    }
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your votes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="option"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex flex-col justify-center items-center gap-2 text-sm">
          <div>Top Voted:</div>
          {topOptions && (
            <div>
              {topOptions.map((option) => (
                <div className="flex gap-2 font-medium leading-none">
                  {option?.content}
                </div>
              ))}
            </div>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}

function getMax(chartProps: ChartOption[]) {
  let maxVal = 0;
  for (let i = 0; i < chartProps.length; i++) {
    if (chartProps[i].votes > maxVal) {
      maxVal = chartProps[i].votes;
    }
  }
  return maxVal;
}
