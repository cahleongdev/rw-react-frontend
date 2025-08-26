import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

// Define the type for school data
interface SchoolOverdueReport {
  name: string;
  overdueReports: number;
}

interface BarChartProps {
  schools: SchoolOverdueReport[];
}

const BarChart = ({ schools }: BarChartProps) => {
  // Transform the schools data to the format expected by the chart
  const chartData = schools.slice(0, 8).map((school, index) => {
    // Create a gradient of red colors from darkest to lightest
    const hue = 0; // Red hue
    const saturation = 85 - index * 5; // Decreasing saturation
    const lightness = 45 + index * 5; // Increasing lightness

    return {
      name:
        school.name.length > 15
          ? `${school.name.substring(0, 15)}...`
          : school.name,
      reports: school.overdueReports,
      fill: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    };
  });

  // If there are more than 8 schools, add a "+X more" entry
  if (schools.length > 8) {
    const remainingCount = schools.length - 8;
    chartData.push({
      name: `+ ${remainingCount} more`,
      reports: Math.min(...schools.slice(8).map((s) => s.overdueReports)),
      fill: 'hsl(0, 45%, 85%)',
    });
  }

  return (
    <ResponsiveContainer width="100%" height={250} className="flex-1">
      <RechartBarChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
      >
        {/* Grid lines every 5 units */}
        <CartesianGrid vertical={false} stroke="lightgray" />
        <XAxis
          dataKey="name"
          height={70}
          interval={0}
          textAnchor="end"
          angle={-45}
          style={{ fill: 'black', fontSize: 12 }}
        />

        {/* Y-Axis with "Reports" label  */}
        <YAxis
          label={{
            value: 'Reports',
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: 12 },
          }}
          axisLine={false}
          tickLine={false}
          tickCount={3} // Controls how many grid lines appear
        />

        <Tooltip />

        <Bar
          dataKey="reports"
          fill="#ff0000"
          radius={[6, 6, 0, 0]}
          fillOpacity={0.9}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </RechartBarChart>
    </ResponsiveContainer>
  );
};

export { BarChart };
