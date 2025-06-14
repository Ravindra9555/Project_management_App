// In: app/dashboard/projects/[projectId]/tasks/components/TaskFormDialog.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/app/store/authStore";
import { format, parseISO } from "date-fns";

// UI and Icons

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/custom-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

import { ProjectDetails, RawTask, Task, TaskPriority, TaskStatus, priorityConfig, statusConfig } from "./types";

export const TaskFormDialog = ({
  mode, open, onOpenChange, project, initialData, onTaskAction, onTaskDelete,onSuccess
}: {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetails | null;
  initialData?: Task | null;
  onTaskAction: (task: RawTask) => void;
    onSuccess: () => void; // CHANGED FROM onTaskAction

  onTaskDelete?: (taskId: string) => void;
}) => {
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
    if (response) onTaskAction(response.data.task);
    onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} task:`, error);
      toast.error(`Could not ${mode} task.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAssignee = (userId: string) => setFormData(prev => ({ ...prev, assignedTo: prev.assignedTo.includes(userId) ? prev.assignedTo.filter(id => id !== userId) : [...prev.assignedTo, userId] }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 p-0">
        <DialogHeader className="p-6 pb-4"><DialogTitle>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</DialogTitle><DialogDescription>{mode === 'add' ? `New task in "${project?.name}".` : `Update details for "${formData.title}".`}</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 max-h-[60vh] overflow-y-auto">
            {/* Form fields... */}
            <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required/></div>
              <div className="space-y-2"><Label>Priority</Label><Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v as TaskPriority})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(priorityConfig).map(p => <SelectItem key={p} value={p}>{priorityConfig[p as TaskPriority].label}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Assign To</Label><Select onValueChange={toggleAssignee} value=""><SelectTrigger><SelectValue placeholder="Add members..."/></SelectTrigger><SelectContent>{project?.assignedUsers.map(u => <SelectItem key={u._id} value={u._id} disabled={formData.assignedTo.includes(u._id)}>{u.name}</SelectItem>)}</SelectContent></Select>
              <div className="flex flex-wrap gap-1 mt-2">{formData.assignedTo.map(id => { const user = project?.assignedUsers.find(u => u._id === id); return user ? <Badge key={id} variant="secondary">{user.name}<button type="button" onClick={() => toggleAssignee(id)} className="ml-1.5 font-bold hover:text-red-500">×</button></Badge> : null; })}</div>
            </div>
            {mode === 'edit' && <div className="space-y-2"><Label>Status</Label><Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as TaskStatus})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{statusConfig[s as TaskStatus].label}</SelectItem>)}</SelectContent></Select></div>}
          </div>
          <div className="flex justify-between items-center p-6 pt-4 border-t border-neutral-800">
            <div>
              {mode === 'edit' && onTaskDelete && initialData && (
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button type="button" ><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Task?</AlertDialogTitle><AlertDialogDescription>This will permanently delete ({initialData.title}). This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { onTaskDelete(initialData._id); onOpenChange(false); }}>Yes, Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin"/> : "Save"}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};