"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { format, differenceInDays, parseISO } from "date-fns";
import { toast } from "react-hot-toast";

// UI Components
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/custom-ui";
import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
import { TaskPageSkeleton } from "./TaskPageSkeleton";

// Icons
import { PlusIcon, Flag, Calendar, ArrowLeft, GripVertical, CheckCircle, Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "low" | "medium" | "high";
type ProjectUser = { _id: string; name: string; email: string; role: string };
type ProjectDetails = { _id: string; name: string; description: string; assignedUsers: ProjectUser[]; };
// The API might return assignedTo as string[] after create/update
type RawTask = Omit<Task, 'assignedTo'> & { assignedTo: string[] };
type Task = { _id: string; title: string; description: string; assignedTo: { _id: string; name: string; email: string }[]; priority: TaskPriority; status: TaskStatus; dueDate: string; };

// --- CONFIGURATION OBJECTS (Unchanged) ---
const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: React.ReactNode }> = {
  low: { label: "Low", color: "text-gray-400", icon: <Flag className="h-4 w-4" /> },
  medium: { label: "Medium", color: "text-yellow-400", icon: <Flag className="h-4 w-4" /> },
  high: { label: "High", color: "text-red-400", icon: <Flag className="h-4 w-4" /> },
};
const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  todo: { label: "To Do", color: "border-neutral-700 bg-neutral-800", icon: <GripVertical className="h-5 w-5 text-neutral-400"/> },
  "in-progress": { label: "In Progress", color: "border-blue-700 bg-blue-950", icon: <div className="h-4 w-4 rounded-full border-2 border-blue-400" /> },
  done: { label: "Done", color: "border-emerald-700 bg-emerald-950", icon: <CheckCircle className="h-5 w-5 text-emerald-400"/> },
};

// ===================================
// === REUSABLE TASK FORM DIALOG (Updated)
// ===================================

function TaskFormDialog({
  mode, open, onOpenChange, project, initialData, onTaskAction
}: {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetails | null;
  initialData?: Task | null;
  onTaskAction: (task: RawTask) => void;
}) {
  const { token, user: authUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "", priority: "medium" as TaskPriority, status: "todo" as TaskStatus, assignedTo: [] as string[] });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({ title: initialData.title, description: initialData.description, dueDate: format(parseISO(initialData.dueDate), "yyyy-MM-dd"), priority: initialData.priority, status: initialData.status, assignedTo: initialData.assignedTo.map(u => u._id) });
    } else {
      setFormData({ title: "", description: "", dueDate: "", priority: "medium", status: "todo", assignedTo: [] });
    }
  }, [initialData, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !authUser) return;
    setIsSubmitting(true);
    
    try {
      let response;
      if (mode === 'add') {
        const payload = { ...formData, projectId: project._id, createdBy: authUser.id };
        response = await axios.post('/api/tasks', payload, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success("Task created successfully!");
      } else if (mode === 'edit' && initialData) {
        const payload = { ...formData };
        response = await axios.patch(`/api/tasks/${initialData._id}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success("Task updated successfully!");
      }
      
      if (response && onTaskAction) {
        // response.data.task will have assignedTo as string[], which is what RawTask expects
        onTaskAction(response.data.task);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} task:`, error);
      toast.error(`Could not ${mode} task.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleAssignee = (userId: string) => { setFormData(prev => ({ ...prev, assignedTo: prev.assignedTo.includes(userId) ? prev.assignedTo.filter(id => id !== userId) : [...prev.assignedTo, userId] })); };
  
  // The rest of the TaskFormDialog JSX remains the same...
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? `Fill in the details for a new task in "${project?.name}".` : `Update the details for "${formData.title}".`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Form fields are unchanged */}
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="bg-neutral-800 border-neutral-700" /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-neutral-800 border-neutral-700" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="dueDate">Due Date</Label><Input id="dueDate" type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required className="bg-neutral-800 border-neutral-700" /></div>
            {mode === 'edit' && (
              <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as TaskStatus})}><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue/></SelectTrigger><SelectContent className="bg-neutral-800 border-neutral-700">{Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{statusConfig[s as TaskStatus].label}</SelectItem>)}</SelectContent></Select></div>
            )}
            <div className="space-y-2"><Label htmlFor="priority">Priority</Label><Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v as TaskPriority})}><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue/></SelectTrigger><SelectContent className="bg-neutral-800 border-neutral-700">{Object.keys(priorityConfig).map(p => <SelectItem key={p} value={p}>{priorityConfig[p as TaskPriority].label}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Assign To</Label><Select onValueChange={toggleAssignee} value=""><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue placeholder="Add team members..." /></SelectTrigger><SelectContent className="bg-neutral-800 border-neutral-700">{project?.assignedUsers.map(user => <SelectItem key={user._id} value={user._id} disabled={formData.assignedTo.includes(user._id)}>{user.name} ({user.role})</SelectItem>)}</SelectContent></Select>
            <div className="flex flex-wrap gap-2 mt-2">
                {formData.assignedTo.map(id => {
                    const user = project?.assignedUsers.find(u => u._id === id);
                    return user ? <Badge key={id} variant="secondary" className="bg-neutral-700">{user.name} <button type="button" onClick={() => toggleAssignee(id)} className="ml-2 font-bold hover:text-red-500">×</button></Badge> : null;
                })}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : "Save Changes"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ===================================
// === TASK CARD COMPONENT (Unchanged) ===
// ===================================
const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void; }) => {
    const dueDate = parseISO(task.dueDate);
    const daysLeft = differenceInDays(dueDate, new Date());
    const deadlineText = daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Today" : `${daysLeft}d left`;
    const deadlineColor = daysLeft < 1 ? "text-red-400" : daysLeft < 7 ? "text-yellow-400" : "text-neutral-400";
    
    return (
        <button onClick={onClick} className="w-full text-left p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-emerald-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <h4 className="font-semibold text-neutral-100">{task.title}</h4>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1.5 ${priorityConfig[task.priority].color}`}>{priorityConfig[task.priority].icon}{priorityConfig[task.priority].label}</span>
                    <span className={`flex items-center gap-1.5 ${deadlineColor}`}><Calendar className="h-4 w-4"/> {deadlineText}</span>
                </div>
                <div className="flex -space-x-2">
                    <AnimatedTooltip items={task.assignedTo.map(user => ({ id: user._id, name: user.name, email: user.email, image: "" }))} />
                </div>
            </div>
        </button>
    );
};

// ===================================
// === MAIN TASK PAGE COMPONENT (Updated) ===
// ===================================
export default function ProjectTasksPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  
  // FIX #1: Correctly get projectId from params.
  // The key 'projectId' must match your folder name [projectId].
  const projectId = params.id as string;
  console.log("Project ID from params:", projectId);
  
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!projectId || !token) { setLoading(false); return; }
    const fetchData = async () => { 
      setLoading(true);
      try {
        console.log ("Fetching project and tasks data for projectId:", projectId);
        const [projectRes, tasksRes] = await Promise.all([
          axios.get(`/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`/api/projects/tasks?projectId=${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        setProject(projectRes.data.project);
        setTasks(tasksRes.data.data);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast.error("Could not load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);
  
  // FIX #2: Central handler to "re-hydrate" task data after create/update
  const handleTaskAction = (rawTask: RawTask) => {
    if (!project) return;
    
    // Convert array of user IDs back into array of user objects
    const populatedAssignees = rawTask.assignedTo
      .map(id => project.assignedUsers.find(u => u._id === id))
      .filter((user): user is ProjectUser => !!user); // Filter out any undefined results
    
    const fullyPopulatedTask: Task = {
      ...rawTask,
      assignedTo: populatedAssignees,
    };

    // Check if it's an update or a new task
    const taskExists = tasks.some(t => t._id === fullyPopulatedTask._id);

    if (taskExists) {
      // Update existing task
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === fullyPopulatedTask._id ? fullyPopulatedTask : task
      ));
    } else {
      // Add new task
      setTasks(prevTasks => [...prevTasks, fullyPopulatedTask]);
    }
  };

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = { todo: [], "in-progress": [], done: [] };
    tasks.forEach(task => {
      // This check prevents the 'status' error
      if (task && task.status) {
        groups[task.status]?.push(task);
      }
    });
    return groups;
  }, [tasks]);

  if (loading) return <TaskPageSkeleton />;
  if (!projectId) return <div className="p-6 text-center text-red-500">Project ID is missing from the URL.</div>;
  if (!project) return <div className="p-6 text-center text-red-500">Project not found or you do not have access.</div>;

  return (
    <div className="p-4 md:p-6 bg-neutral-950 min-h-screen text-neutral-100">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/projects')} className="mb-2 text-neutral-400 hover:bg-neutral-800"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Button>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-neutral-400 mt-1 max-w-2xl">{project.description}</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-950/50"><PlusIcon className="mr-2 h-4 w-4" /> Add Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
          <div key={status} className={`p-4 rounded-lg border-t-4 ${statusConfig[status].color}`}>
            <div className="flex items-center gap-2 mb-4">
                {statusConfig[status].icon}
                <h2 className="font-semibold text-lg">{statusConfig[status].label}</h2>
                <span className="text-sm font-mono bg-neutral-700 text-neutral-300 rounded-full px-2 py-0.5">{groupedTasks[status]?.length || 0}</span>
            </div>
            <div className="space-y-4">
              {groupedTasks[status]?.length > 0 ? (
                groupedTasks[status].map(task => <TaskCard key={task._id} task={task} onClick={() => setEditingTask(task)} />)
              ) : (
                <div className="text-center py-10 text-neutral-600">No tasks here.</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Use the single TaskFormDialog for both Add and Edit modes */}
      <TaskFormDialog 
        mode="add"
        open={isAddModalOpen} 
        onOpenChange={setAddModalOpen} 
        project={project}
        onTaskAction={handleTaskAction}
      />
      
      <TaskFormDialog 
        mode="edit"
        open={!!editingTask} 
        onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
        project={project}
        initialData={editingTask}
        onTaskAction={handleTaskAction}
      />
    </div>
  );
}