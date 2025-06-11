// import { dbConnect } from '../config/dbConfig';
// import Task from '@/models/Task';
// import User from '@/models/User';

// export async function getTasksAnalytics() {
//   await dbConnect();
  
//   const tasks = await Task.find();
//   const now = new Date();
//   const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

//   // Task status distribution
//   const statusDistribution = [
//     { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
//     { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
//     { name: 'Review', value: tasks.filter(t => t.status === 'review').length },
//     { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
//   ];

//   // Weekly completion (last 8 weeks)
//   const weeklyCompletion = Array.from({ length: 8 }).map((_, i) => {
//     const weekStart = new Date();
//     weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
//     const weekEnd = new Date(weekStart);
//     weekEnd.setDate(weekEnd.getDate() + 7);

//     return {
//       week: `Week ${i + 1}`,
//       count: tasks.filter(t => 
//         t.status === 'done' && 
//         t.updatedAt >= weekStart && 
//         t.updatedAt < weekEnd
//       ).length
//     };
//   });

//   return {
//     totalTasks: tasks.length,
//     completedTasks: tasks.filter(t => t.status === 'done').length,
//     completionRate: calculateGrowth(tasks, 'done'),
//     avgCompletionDays: calculateAvgCompletion(tasks),
//     efficiencyChange: calculateEfficiencyChange(tasks),
//     statusDistribution,
//     weeklyCompletion,
//     priorityDistribution: [
//       { priority: 'High', count: tasks.filter(t => t.priority === 'high').length },
//       { priority: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
//       { priority: 'Low', count: tasks.filter(t => t.priority === 'low').length }
//     ]
//   };
// }

// export async function getResourceUtilization() {
//   await dbConnect();
  
//   const users = await User.find({ isActive: true });
//   const tasks = await Task.find().populate('assignedTo');

//   // Calculate utilization per user
//   const userUtilization = users.map(user => {
//     const assignedTasks = tasks.filter(t => 
//       t.assignedTo.some((u: any) => u._id.toString() === user._id.toString())
//     );
//     return {
//       userId: user._id,
//       utilization: Math.min(assignedTasks.length * 10, 100) // Simplified calculation
//     };
//   });

//   // Weekly utilization (last 8 weeks)
//   const weeklyUtilization = Array.from({ length: 8 }).map((_, i) => {
//     const weekStart = new Date();
//     weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
    
//     return {
//       week: `Week ${i + 1}`,
//       percentage: Math.floor(Math.random() * 30) + 70 // Mock data
//     };
//   });

//   return {
//     utilization: Math.round(
//       userUtilization.reduce((sum, u) => sum + u.utilization, 0) / userUtilization.length
//     ),
//     change: calculateUtilizationChange(userUtilization),
//     weeklyUtilization
//   };
// }

// // Helper functions
// function calculateGrowth(tasks: any[], status: string) {
//   const current = tasks.filter(t => t.status === status).length;
//   const previous = tasks.filter(t => 
//     t.status === status && 
//     t.createdAt < new Date(new Date().setMonth(new Date().getMonth() - 1))
//   ).length;
//   return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
// }

// function calculateAvgCompletion(tasks: any[]) {
//   const completed = tasks.filter(t => t.status === 'done');
//   if (completed.length === 0) return 0;
  
//   const totalDays = completed.reduce((sum, task) => {
//     const created = new Date(task.createdAt);
//     const updated = new Date(task.updatedAt);
//     return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
//   }, 0);
  
//   return Math.round(totalDays / completed.length);
// }

// function calculateEfficiencyChange(tasks: any[]) {
//   // Simplified calculation
//   return Math.floor(Math.random() * 20) - 10; // Random between -10 and +10
// }

// function calculateUtilizationChange(utilization: any[]) {
//   // Simplified calculation
//   return Math.floor(Math.random() * 15) - 5; // Random between -5 and +10
// }

export async function getTasksAnalytics() {
  // Dummy tasks data
  const tasks = [
    {
      status: 'done',
      priority: 'high',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-03'),
    },
    {
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-03'),
    },
    {
      status: 'todo',
      priority: 'low',
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-03'),
    },
    {
      status: 'done',
      priority: 'medium',
      createdAt: new Date('2024-04-20'),
      updatedAt: new Date('2024-04-26'),
    },
  ];

  // Task status distribution
  const statusDistribution = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
  ];

  // Weekly completion mock (based on updatedAt)
  const weeklyCompletion = Array.from({ length: 8 }).map((_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (7 * (7 - i)));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return {
      week: `Week ${i + 1}`,
      count: tasks.filter(t =>
        t.status === 'done' &&
        t.updatedAt >= weekStart &&
        t.updatedAt < weekEnd
      ).length
    };
  });

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    completionRate: calculateGrowth(tasks, 'done'),
    avgCompletionDays: calculateAvgCompletion(tasks),
    efficiencyChange: calculateEfficiencyChange(),
    statusDistribution,
    weeklyCompletion,
    priorityDistribution: [
      { priority: 'High', count: tasks.filter(t => t.priority === 'high').length },
      { priority: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
      { priority: 'Low', count: tasks.filter(t => t.priority === 'low').length }
    ]
  };
}

export async function getResourceUtilization() {
  // Dummy users
  const users = [
    { _id: '1', name: 'Alice', isActive: true },
    { _id: '2', name: 'Bob', isActive: true }
  ];

  // Dummy tasks with assignments
  const tasks = [
    { assignedTo: [{ _id: '1' }] },
    { assignedTo: [{ _id: '1' }, { _id: '2' }] },
    { assignedTo: [{ _id: '2' }] }
  ];

  const userUtilization = users.map(user => {
    const assignedTasks = tasks.filter(t =>
      t.assignedTo.some(u => u._id === user._id)
    );
    return {
      userId: user._id,
      utilization: Math.min(assignedTasks.length * 10, 100)
    };
  });

  const weeklyUtilization = Array.from({ length: 8 }).map((_, i) => ({
    week: `Week ${i + 1}`,
    percentage: Math.floor(Math.random() * 30) + 70
  }));

  return {
    utilization: Math.round(
      userUtilization.reduce((sum, u) => sum + u.utilization, 0) / userUtilization.length
    ),
    change: calculateUtilizationChange(),
    weeklyUtilization
  };
}

// Helpers (same as before)
function calculateGrowth(tasks: any[], status: string) {
  const current = tasks.filter(t => t.status === status).length;
  const previous = tasks.filter(t =>
    t.status === status &&
    t.createdAt < new Date(new Date().setMonth(new Date().getMonth() - 1))
  ).length;
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
}

function calculateAvgCompletion(tasks: any[]) {
  const completed = tasks.filter(t => t.status === 'done');
  if (completed.length === 0) return 0;

  const totalDays = completed.reduce((sum, task) => {
    const created = new Date(task.createdAt);
    const updated = new Date(task.updatedAt);
    return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);

  return Math.round(totalDays / completed.length);
}

function calculateEfficiencyChange() {
  return Math.floor(Math.random() * 20) - 10;
}

function calculateUtilizationChange() {
  return Math.floor(Math.random() * 15) - 5;
}
