"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  BarChart,
  LineChart,
  DonutChart,
  AreaChart,
} from "@/app/components/charts";
import { getTasksAnalytics, getResourceUtilization } from "@/app/lib/analytics";
import { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  interface TaskData {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    avgCompletionDays: number;
    efficiencyChange: number;
    statusDistribution: Array<{ name: string; value: number }>;
    weeklyCompletion: Array<{ week: string; count: number }>;
    priorityDistribution: Array<{ priority: string; count: number }>;
  }

  interface ResourceData {
    utilization: number;
    change: number;
    weeklyUtilization: Array<{ week: string; percentage: number }>;
  }

  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTasksAnalytics(), getResourceUtilization()])
      .then(([tasks, resources]) => {
        setTaskData(tasks);
        setResourceData(resources);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !taskData || !resourceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
     
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={taskData.totalTasks}
          change={taskData.completionRate}
        />
        <StatCard
          title="Completed"
          value={taskData.completedTasks}
          change={taskData.completionRate}
        />
        <StatCard
          title="Team Capacity"
          value={`${resourceData.utilization}%`}
          change={resourceData.change}
        />
        <StatCard
          title="Avg. Completion"
          value={`${taskData.avgCompletionDays}d`}
          change={taskData.efficiencyChange}
        />
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Task Status Distribution">
          <DonutChart
            data={taskData.statusDistribution}
            colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
          />
        </ChartCard>

        <ChartCard title="Weekly Task Completion">
          <LineChart
            data={taskData.weeklyCompletion}
            xAxisKey="week"
            yAxisKey="count"
          />
        </ChartCard>
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Resource Utilization">
          <AreaChart
            data={resourceData.weeklyUtilization}
            xAxisKey="week"
            yAxisKey="percentage"
          />
        </ChartCard>

        <ChartCard title="Task Priority">
          <BarChart
            data={taskData.priorityDistribution}
            xAxisKey="priority"
            yAxisKey="count"
          />
        </ChartCard>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string | number;
  change: number;
}) {
  return (
    <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last period
        </p>
      </CardContent>
    </Card>
  );
}

// Reusable Chart Card Component
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">{children}</CardContent>
    </Card>
  );
}
