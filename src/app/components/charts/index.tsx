import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export function BarChart({ data, xAxisKey, yAxisKey }: { 
  data: any[]; 
  xAxisKey: string; 
  yAxisKey: string 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxisKey} fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data, xAxisKey, yAxisKey }: { 
  data: any[]; 
  xAxisKey: string; 
  yAxisKey: string 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={yAxisKey} 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, colors }: { 
  data: { name: string; value: number }[]; 
  colors: string[] 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, colors }: { 
  data: { name: string; value: number }[]; 
  colors: string[] 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function AreaChart({ data, xAxisKey, yAxisKey }: { 
  data: any[]; 
  xAxisKey: string; 
  yAxisKey: string 
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey={yAxisKey} 
          stroke="#8884d8" 
          fill="#8884d8" 
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}