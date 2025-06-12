

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays, parseISO } from "date-fns";
import { toast } from "react-hot-toast";

// UI Components
import { Button } from "@/app/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
import { Input } from "@/app/components/ui/input";
import { Badge,  Progress } from "@/app/components/ui/custom-ui";
import { ProjectsSkeleton } from "./ProjectSkeleton";
// Icons
import { PlusIcon,  Trash2, Edit,  Search, LayoutGrid, List, FileText } from "lucide-react";

// --- TYPE DEFINITIONS ---
type ProjectStatus = "not-started" | "in-progress" | "on-hold" | "completed";
type TaskStatus = "todo" | "in-progress" | "done";

type Project = {
  _id: string;
  name: string;
  description: string;
  assignedUsers: { _id: string; name: string; email: string; }[];
  status: ProjectStatus;
  deadline: string;
  tasks?: { status: TaskStatus }[];
};

// --- CONFIGURATION FOR STATUSES ---
const statusConfig: Record<ProjectStatus, { label: string; color: string; }> = {
  "in-progress": { label: "In Progress", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "completed": { label: "Completed", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  "on-hold": { label: "On Hold", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  "not-started": { label: "Not Started", color: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30" },
};


function ProjectCard({ project, onDelete, onEdit, onViewTasks }: {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewTasks: (id: string) => void;
}) {
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'done').length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const deadlineDate = parseISO(project.deadline);
  const daysLeft = differenceInDays(deadlineDate, new Date());
  const deadlineInfo =
    daysLeft < 0 ? { text: `${Math.abs(daysLeft)} days overdue`, color: "text-red-400" } :
    daysLeft < 7 ? { text: `${daysLeft} days left`, color: "text-yellow-400" } :
    { text: format(deadlineDate, "MMM dd, yyyy"), color: "text-neutral-500" };

  return (
    // Use a group for hover effects on child elements
    <div className="p-3  group relative flex flex-col bg-neutral-900 border-neutral-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-emerald-600/50 hover:bg-neutral-900/50">
      
      {/* --- Clickable Main Area for Viewing Tasks --- */}
      <button 
        onClick={() => onViewTasks(project._id)}
        className=" p-2 flex-grow flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
      >
        <CardHeader>
          <CardTitle className="text-neutral-100 line-clamp-1">{project.name}</CardTitle>
          <CardDescription className="text-neutral-400 h-10 line-clamp-2 mt-1">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-neutral-300">Progress</h3>
              <span className="text-sm font-semibold text-emerald-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-neutral-300">Team</h3>
            <div className="flex -space-x-2">
              <AnimatedTooltip
                items={project.assignedUsers.map(user => ({ id: user._id, name: user.name, email: user.email, image: "" }))}
              />
            </div>
          </div>
        </CardContent>
      </button>

      {/* --- Footer Area (Not part of the button to avoid nested interactive elements) --- */}
      <CardFooter className="flex justify-between items-center text-sm border-t border-neutral-800/50 pt-3">
        <Badge variant="outline" className={`capitalize ${statusConfig[project.status].color}`}>
          {statusConfig[project.status].label}
        </Badge>
        <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
      </CardFooter>

      {/* --- Hover Actions Overlay --- */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 bg-neutral-800/50 hover:bg-neutral-700"
          onClick={(e) => { e.stopPropagation(); onEdit(project._id); }}
          aria-label="Edit Project"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 bg-neutral-800/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
          onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
          aria-label="Delete Project"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}
// ===================================
// === MAIN PROJECTS PAGE COMPONENT ===
// ===================================
export default function ProjectsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const statusFilter = "all"; // For simplicity, we are not implementing status filter in this example
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const response = await axios.get("/api/projects?includeTasks=true", { // Assuming API can include tasks
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAllProjects(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Could not fetch projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  // Memoized filtering logic
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter(p => statusFilter === "all" || p.status === statusFilter)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allProjects, statusFilter, searchTerm]);

  // Handlers
  const handleDeleteProject = async (projectId: string) => {
    // Optimistic UI update
    const originalProjects = [...allProjects];
    setAllProjects(prev => prev.filter(p => p._id !== projectId));

    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Project deleted successfully");
    } catch (error) {
      // Revert on failure
      setAllProjects(originalProjects);
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEditProject = (projectId: string) => router.push(`/dashboard/projects/edit/${projectId}`);
  const handleViewTasks = (projectId: string) => router.push(`/dashboard/projects/${projectId}/tasks`);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (loading) {
    return (
       <div className="space-y-6 p-6 bg-neutral-950 min-h-screen">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-40 bg-neutral-800 rounded-md animate-pulse" />
            <div className="h-10 w-36 bg-neutral-800 rounded-md animate-pulse" />
          </div>
          <div className="flex gap-4 items-center">
             <div className="h-10 flex-grow bg-neutral-800 rounded-md animate-pulse" />
             <div className="h-10 w-32 bg-neutral-800 rounded-md animate-pulse" />
          </div>
          <ProjectsSkeleton />
       </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-neutral-950 min-h-screen text-neutral-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => router.push("/dashboard/projects/add")} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/50 shadow-lg">
          <PlusIcon className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center p-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
          <Input 
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 border-neutral-700 pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown would go here */}
          <span className="text-sm text-neutral-400">Layout:</span>
          <Button variant="ghost" size="icon" onClick={() => setLayout("grid")} className={layout === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-neutral-500'}>
            <LayoutGrid className="h-5 w-5" />
          </Button>
          {/* List view can be implemented later */}
          <Button variant="ghost" size="icon" onClick={() => setLayout("list")} className={layout === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-neutral-500'}>
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Projects Grid / List */}
      <AnimatePresence>
        {filteredProjects.length > 0 ? (
          <motion.div 
            key="project-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project._id} variants={itemVariants}>
                <ProjectCard 
                  project={project} 
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                  onViewTasks={handleViewTasks}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 col-span-full border-2 border-dashed border-neutral-800 rounded-lg flex flex-col items-center"
          >
            <FileText className="h-16 w-16 text-neutral-700" />
            <h2 className="mt-4 text-xl font-semibold">No projects match your search</h2>
            <p className="text-neutral-400 mt-2">Try clearing your search or creating a new project.</p>
            <Button onClick={() => router.push("/dashboard/projects/add")} className="mt-6 bg-emerald-600 hover:bg-emerald-700">
              Create First Project
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}