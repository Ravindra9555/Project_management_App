
"use client";

import { Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/app/components/ui/dialog'

import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { PlusIcon,  EllipsisVertical, Trash2, Edit, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedUsers: {
    _id: string;
    name: string;
    email: string;
  }[];
  status: string;
  deadline: string;
  tasks?: Task[];
};

type Task = {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string[];
  priority: string;
  status: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const {  token } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleAddProject = () => {
    router.push("/dashboard/projects/add");
  };

  const handleViewProject = async (projectId: string) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedProject(response.data.project);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjects(projects.filter(project => project._id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/projects/edit/${projectId}`);
  };

  const handleViewTasks = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}/tasks`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading) {
    return <div className="p-6 text-neutral-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-neutral-950 min-h-screen text-neutral-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button 
          onClick={handleAddProject}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project._id} 
            className="hover:shadow-lg transition-shadow bg-neutral-900 border-neutral-800 hover:border-emerald-500/30"
          >
            <CardHeader>
              <CardTitle className="text-neutral-100">{project.name}</CardTitle>
              <CardDescription className="text-neutral-400">
                {project.description}
              </CardDescription>
              <div className="text-sm text-neutral-500">
                Deadline: {formatDate(project.deadline)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-neutral-300">
                    Team Members
                  </h3>
                  <div className="flex -space-x-2">
                    <AnimatedTooltip
                      items={project.assignedUsers.map(user => ({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        image: ""
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button 
                variant="outline" 
                className="border-neutral-700 text-neutral-300 hover:text-white"
                onClick={() => handleViewProject(project._id)}
              >
                View Details
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                    <EllipsisVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-neutral-100 w-48">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-neutral-700"
                    onClick={() => handleViewTasks(project._id)}
                  >
                    <ListTodo className="mr-2 h-4 w-4" />
                    View Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-neutral-700"
                    onClick={() => handleEditProject(project._id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500 hover:bg-neutral-700 hover:text-red-400"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProject.name}</DialogTitle>
              <DialogDescription className="text-neutral-400">
                {selectedProject.description}
              </DialogDescription>
              <div className="text-sm text-neutral-500">
                Deadline: {formatDate(selectedProject.deadline)} | Status: {selectedProject.status}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.assignedUsers.map(user => (
                    <div key={user._id} className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="border-neutral-700"
                  onClick={() => handleEditProject(selectedProject._id)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
                <Button 
                  variant="outline" 
                  className="border-neutral-700"
                  onClick={() => handleViewTasks(selectedProject._id)}
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  View All Tasks
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}