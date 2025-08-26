'use client';

import * as React from 'react';
import { PieChart, Pie, Label } from 'recharts';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from '../Chart';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface DonutChartProps {
  title?: string;
  data: ChartData[];
  config: ChartConfig;
  innerRadius?: string;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const CustomTooltipFormatter = (
  value: ValueType,
  name: NameType,
  config: ChartConfig,
) => {
  const numericValue = Array.isArray(value) ? value[0] : value;

  // Find the config entry where the label matches the name
  let color = '#cccccc'; // Default fallback color

  // Loop through config entries to find matching label
  for (const key in config) {
    if (config[key].label === name) {
      color = config[key].color;
      break;
    }
  }

  return (
    <div className="flex justify-between w-full gap-4">
      <span className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-muted-foreground">{name}</span>
      </span>
      <span className="text-foreground font-mono font-medium tabular-nums">
        {numericValue}
      </span>
    </div>
  );
};

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  config,
  innerRadius = '60%',
}) => {
  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <div className="flex flex-col gap-2 items-center w-[200px]">
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      <ChartContainer
        config={config}
        className="mx-auto aspect-square max-h-[166px] p-0 w-full"
      >
        <PieChart className="m-0" width={160} height={160}>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) =>
                  CustomTooltipFormatter(value, name, config)
                }
                className="min-w-[100px]"
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius="100%"
            strokeWidth={5}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
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
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalAmount.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col gap-1 text-sm w-full">
        {data.map((item) => {
          // Calculate percentage
          const percentage =
            totalAmount > 0
              ? ((item.value / totalAmount) * 100).toFixed(1)
              : '0.0';

          return (
            <div
              key={item.name}
              className="flex items-center gap-2 justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm">
                {item.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { DonutChart };
