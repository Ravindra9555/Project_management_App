"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";

// UI Components
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Skeleton } from "@/app/components/ui/custom-ui"; // Assuming you have this

// Icons
import { CalendarIcon, Users, Check, ArrowLeft, Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
type ProjectStatus = "not-started" | "in-progress" | "on-hold" | "completed";
type UserRole = "engineer" | "worker" | "client";

type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

// ===================================
// === EDIT PROJECT PAGE COMPONENT ===
// ===================================
export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { user: authUser, token } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedUsers: [] as string[],
    deadline: new Date(),
    status: "not-started" as ProjectStatus,
  });

  // State for user fetching and management
  const [allKnownUsers, setAllKnownUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>("engineer");

  // State for page status
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Initial Data Fetching ---
  useEffect(() => {
    if (!projectId || !token || !authUser?.companyId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project details and initial user list concurrently
        const [projectRes, usersRes] = await Promise.all([
          axios.get(`/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.post('/api/company/users', { companyId: authUser.companyId, role: selectedRole }, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        const projectData = projectRes.data.project;
        const initialUsers = usersRes.data.users || [];

        // Pre-populate the form
        setFormData({
          name: projectData.name,
          description: projectData.description,
          assignedUsers: projectData.assignedUsers.map((u: User) => u._id),
          deadline: parseISO(projectData.deadline),
          status: projectData.status,
        });

        // Populate user lists
        setAllKnownUsers(initialUsers);
        setDisplayedUsers(initialUsers);

      } catch (error) {
        console.error("Failed to fetch initial project data:", error);
        toast.error("Could not load project data. Redirecting...");
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, token, authUser?.companyId, router]); // Dependency on router to satisfy linting

  // --- Fetch users when role filter changes ---
  useEffect(() => {
    if (!authUser?.companyId || !token) return;
    
    const fetchUsersByRole = async () => {
        const roleAlreadyFetched = allKnownUsers.some(user => user.role === selectedRole);
        if (roleAlreadyFetched) {
            setDisplayedUsers(allKnownUsers.filter(user => user.role === selectedRole));
            return;
        }

        try {
            const response = await axios.post('/api/company/users', { companyId: authUser.companyId, role: selectedRole }, { headers: { 'Authorization': `Bearer ${token}` } });
            const newUsers: User[] = response.data.users || [];
            
            setDisplayedUsers(newUsers);
            setAllKnownUsers(prev => {
                const knownIds = new Set(prev.map(u => u._id));
                const uniqueNew = newUsers.filter(u => !knownIds.has(u._id));
                return [...prev, ...uniqueNew];
            });
        } catch (error) {
            console.error(`Failed to fetch ${selectedRole}s:`, error);
            toast.error(`Could not load ${selectedRole}s.`);
        }
    };

    if (!loading) { // Avoid fetching on initial load as the first useEffect handles it
      fetchUsersByRole();
    }
  }, [selectedRole, authUser?.companyId, token, loading, allKnownUsers]);

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      deadline: format(formData.deadline, "yyyy-MM-dd"), // Format date for API
    };

    try {
      await axios.put(`/api/projects/${projectId}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success("Project updated successfully!");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleUserAssignment = (userId: string) => {
    setFormData(prev => ({ ...prev, assignedUsers: prev.assignedUsers.includes(userId) ? prev.assignedUsers.filter(id => id !== userId) : [...prev.assignedUsers, userId] }));
  };

  if (loading) {
    return <EditPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl bg-neutral-900 border-neutral-800 shadow-2xl shadow-emerald-950/20">
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2 text-neutral-400 hover:bg-neutral-800 w-fit -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="text-2xl">Edit Project</CardTitle>
          <CardDescription>Update the details for {formData.name}.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-neutral-800 border-neutral-700" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="bg-neutral-800 border-neutral-700" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700"><CalendarIcon className="mr-2 h-4 w-4"/>{formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.deadline} onSelect={(date) => date && setFormData({...formData, deadline: date})} initialFocus /></PopoverContent></Popover>
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as ProjectStatus})}><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue/></SelectTrigger><SelectContent>{['not-started', 'in-progress', 'on-hold', 'completed'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('-', ' ')}</SelectItem>)}</SelectContent></Select>
                </div>
            </div>

            <div className="space-y-4 rounded-lg border border-neutral-800 p-4">
              <h3 className="font-semibold text-neutral-200 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-500"/> Manage Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Filter by Role</Label><Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue/></SelectTrigger><SelectContent>{['engineer', 'worker', 'client'].map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Add User</Label><Select onValueChange={(userId) => userId && toggleUserAssignment(userId)} value=""><SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue placeholder="Select from list"/></SelectTrigger><SelectContent>{displayedUsers.map(user => <SelectItem key={user._id} value={user._id}><div className="flex items-center justify-between w-full"><span>{user.name}</span>{formData.assignedUsers.includes(user._id) && <Check className="h-4 w-4 text-emerald-500"/>}</div></SelectItem>)}</SelectContent></Select></div>
              </div>

              {formData.assignedUsers.length > 0 && (
                <div className="pt-4 border-t border-neutral-800 mt-4"><Label className="text-neutral-300">Currently Assigned:</Label><div className="flex flex-wrap gap-2 mt-2">{formData.assignedUsers.map(userId => { const user = allKnownUsers.find(u => u._id === userId); return user ? (<div key={userId} className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full text-sm"><span className="font-medium text-neutral-200">{user.name}</span><span className="text-xs text-neutral-400 capitalize">({user.role})</span><button type="button" onClick={() => toggleUserAssignment(userId)} className="ml-1.5 text-neutral-500 hover:text-white">×</button></div>) : null; })}</div></div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 p-6 bg-neutral-900/50 border-t border-neutral-800">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// --- Skeleton Component for Loading State ---
function EditPageSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
            <Card className="w-full max-w-3xl bg-neutral-900 border-neutral-800">
                <CardHeader><Skeleton className="h-8 w-48 bg-neutral-800"/><Skeleton className="h-4 w-72 mt-2 bg-neutral-800"/></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24 bg-neutral-800"/><Skeleton className="h-20 w-full bg-neutral-800"/></div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-24 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24 bg-neutral-800"/><Skeleton className="h-10 w-full bg-neutral-800"/></div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4 border-t border-neutral-800 pt-6 mt-6">
                    <Skeleton className="h-10 w-24 bg-neutral-800"/>
                    <Skeleton className="h-10 w-36 bg-neutral-800"/>
                </CardFooter>
            </Card>
        </div>
    );
}