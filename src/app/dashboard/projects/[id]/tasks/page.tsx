// // In: app/dashboard/projects/[projectId]/tasks/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuthStore } from "@/app/store/authStore";
// import { toast } from "react-hot-toast";

// // DND-Kit Imports
// import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

// // UI Components & Icons
// import { Button } from "@/app/components/ui/button";
// import { ArrowLeft, PlusIcon } from "lucide-react";
// import { TaskPageSkeleton } from "./TaskPageSkeleton";

// // Local Components & Types
// import { ProjectDetails, RawTask, Task, TaskStatus, ProjectUser, statusConfig } from "./components/types";
// import { TaskFormDialog } from "./components/TaskFormDialog";
// import { KanbanColumn } from "./components/KanbanColumn";
// import { TaskCard } from "./components/TaskCard";

// export default function ProjectTasksPage() {
//   const router = useRouter();
//   const params = useParams();
//   const projectId = params.id as string;
//   const { token } = useAuthStore();

//   const [project, setProject] = useState<ProjectDetails | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isAddModalOpen, setAddModalOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [activeTask, setActiveTask] = useState<Task | null>(null);

//   const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

//   useEffect(() => {
//     if (!projectId || !token) { setLoading(false); return; }
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [projectRes, tasksRes] = await Promise.all([
//           axios.get(`/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
//           axios.get(`/api/projects/tasks?projectId=${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         ]);
//         setProject(projectRes.data.project);
//         setTasks(tasksRes.data.data);
//       } catch (error) { toast.error("Could not load project details."); } finally { setLoading(false); }
//     };
//     fetchData();
//   }, [projectId, token,]);

//   const handleTaskAction = (rawTask: RawTask) => {
//     if (!project) return;
//     const populatedAssignees = rawTask.assignedTo.map(id => project.assignedUsers.find(u => u._id === id)).filter((u): u is ProjectUser => !!u);
//     const fullyPopulatedTask: Task = { ...rawTask, assignedTo: populatedAssignees };
//     const taskExists = tasks.some(t => t._id === fullyPopulatedTask._id);
//     if (taskExists) {
//       setTasks(prev => prev.map(t => t._id === fullyPopulatedTask._id ? fullyPopulatedTask : t));
//     } else {
//       setTasks(prev => [...prev, fullyPopulatedTask]);
//     }
//   };

//   const handleTaskDelete = async (taskId: string) => {
//     const originalTasks = [...tasks];
//     setTasks(prev => prev.filter((t) => t._id !== taskId));
//     try {
//       await axios.delete(`/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
//       toast.success("Task deleted.");
//     } catch {
//       setTasks(originalTasks);
//       toast.error("Failed to delete task.");
//     }
//   };

//   const handleDragStart = (event: DragStartEvent) => {
//     const task = tasks.find(t => t._id === event.active.id);
//     if (task) setActiveTask(task);
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     setActiveTask(null);
//     const { active, over } = event;
//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     if (activeId === overId) return;

//     const activeTask = tasks.find(t => t._id === activeId);
//     // The `overId` is now the column status ('todo', 'in-progress', 'done')
//     const newStatus = overId as TaskStatus;

//     if (activeTask && activeTask.status !== newStatus) {
//       // Optimistic UI Update
//       setTasks(prev => prev.map(t => t._id === activeId ? { ...t, status: newStatus } : t));

//       // API Call
//       axios.patch(`/api/tasks/${activeId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
//         .then(() => toast.success(`Task moved to "${statusConfig[newStatus].label}"`))
//         .catch(() => {
//           setTasks(tasks); // Revert on failure
//           toast.error("Failed to update status.");
//         });
//     }
//   };

//   const groupedTasks = useMemo(() => {
//     const groups: Record<TaskStatus, Task[]> = { todo: [], "in-progress": [], done: [] };
//     tasks.forEach(task => task?.status && groups[task.status]?.push(task));
//     return groups;
//   }, [tasks]);

//   if (loading) return <TaskPageSkeleton />;
//   if (!project) return <div className="p-6 text-center text-red-500">Project not found.</div>;

//   return (
//     <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//       <div className="p-4 md:p-6 bg-neutral-950 min-h-screen text-neutral-100">
//         <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
//           <div>
//             <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/projects')} className="mb-2 text-neutral-400 hover:bg-neutral-800"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
//             <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
//             <p className="text-neutral-400 mt-1 max-w-2xl">{project.description}</p>
//           </div>
//           <Button onClick={() => setAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700"><PlusIcon className="mr-2 h-4 w-4"/> Add Task</Button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
//           {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
//             <KanbanColumn key={status} status={status} tasks={groupedTasks[status]} onClickTask={setEditingTask} />
//           ))}
//         </div>
//         <DragOverlay>
//           {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
//         </DragOverlay>
//       </div>
//       <TaskFormDialog mode="add" open={isAddModalOpen} onOpenChange={setAddModalOpen} project={project} onTaskAction={handleTaskAction} />
//       <TaskFormDialog mode="edit" open={!!editingTask} onOpenChange={isOpen => !isOpen && setEditingTask(null)} project={project} initialData={editingTask} onTaskAction={handleTaskAction} onTaskDelete={handleTaskDelete} />
//     </DndContext>
//   );
// }

// In: app/dashboard/projects/[projectId]/tasks/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { toast, Toaster } from "react-hot-toast";

// DND-Kit Imports
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// UI Components & Icons
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { TaskPageSkeleton } from "./TaskPageSkeleton";

// Local Components & Types
import {
  ProjectDetails,
  Task,
  TaskStatus,
  statusConfig,
} from "./components/types";
import { TaskFormDialog } from "./components/TaskFormDialog";
import { KanbanColumn } from "./components/KanbanColumn";
import { TaskCard } from "./components/TaskCard";
import { fetchTaskPageData } from  './refetch'

export default function ProjectTasksPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { token } = useAuthStore();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: The state that will trigger data refetching ---
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const triggerRefetch = () => setRefetchTrigger((c) => c + 1);

  // State for Modals and Dragging
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // --- UPDATED: Main data fetching effect ---
  useEffect(() => {
    if (!projectId || !token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { project, tasks } = await fetchTaskPageData(projectId, token);
        setProject(project);
        setTasks(tasks);
      } catch {
        toast.error("Could not load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, token, refetchTrigger]); // <-- Added refetchTrigger to dependency array

  // --- UPDATED: Delete handler ---
  const handleTaskDelete = async (taskId: string) => {
    // We still keep optimistic UI for snappy deletes
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully.");
    } catch { // Revert on failure
      toast.error("Failed to delete task.");
    }
  };

  // --- UPDATED: Drag-and-drop handler ---
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const newStatus = over.id as TaskStatus;

    if (activeTask && activeTask.status !== newStatus) {
      // Optimistic UI Update remains
      setTasks((prev) =>
        prev.map((t) => (t._id === active.id ? { ...t, status: newStatus } : t))
      );

      // API Call
      axios
        .patch(
          `/api/tasks/${active.id}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() =>
          toast.success(`Task moved to "${statusConfig[newStatus].label}"`)
        )
        .catch(() => {
          toast.error("Failed to update status. Reverting.");
          // On failure, trigger a full refetch to ensure sync
          triggerRefetch();
        });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    tasks.forEach((task) => task?.status && groups[task.status]?.push(task));
    return groups;
  }, [tasks]);

  if (loading) return <TaskPageSkeleton />;
  if (!project)
    return (
      <div className="p-6 text-center text-red-500">Project not found.</div>
    );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 md:p-6 bg-neutral-950 min-h-screen text-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              className="mb-2 text-neutral-400 hover:bg-neutral-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-neutral-400 mt-1 max-w-2xl">
              {project.description}
            </p>
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={groupedTasks[status]}
              onClickTask={setEditingTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </div>

      {/* UPDATED: Pass the triggerRefetch function as the onSuccess prop */}
      <TaskFormDialog
        mode="add"
        open={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        project={project}
        onTaskAction={() => {}} // Provide a no-op or your actual handler
        onSuccess={triggerRefetch}
      />
      <TaskFormDialog
        mode="edit"
        open={!!editingTask}
        onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
        project={project}
        initialData={editingTask}
        onTaskAction={() => {}} // Provide a no-op or your actual handler
        onSuccess={triggerRefetch}
        onTaskDelete={handleTaskDelete}
      />
      <Toaster />
    </DndContext>
  );
}
