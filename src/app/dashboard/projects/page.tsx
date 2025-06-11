
"use client";
// import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
// import { Button } from "@/app/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
// import { PlusIcon, ChevronRightIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// // import { useSession } from "next-auth/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/app/components/ui/dialog'
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import { Textarea } from "@/app/components/ui/textarea";
// import { format } from "date-fns";
// import { useAuthStore } from "@/app/store/authStore";
// import axios from "axios";
// type Project = {
//   _id: string;
//   name: string;
//   description: string;
//   createdBy: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   assignedUsers: {
//     _id: string;
//     name: string;
//     email: string;
//   }[];
//   status: string;
//   deadline: string;
//   tasks?: Task[];
// };

// type Task = {
//   _id?: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   assignedTo: string[];
//   priority: string;
//   status: string;
// };

// export default function ProjectsPage() {
//   const router = useRouter();
//   // const { data: session } = useSession();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [newTask, setNewTask] = useState<Task>({
//     title: "",
//     description: "",
//     dueDate: "",
//     assignedTo: [],
//     priority: "medium",
//     status: "todo"
//   });
//   const [loading, setLoading] = useState(true);

//   const { user, token } = useAuthStore();

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get('/api/projects', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         setProjects(response.data.projects);
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchProjects();
//     }
//   }, [token]);

//   const handleAddProject = () => {
//     router.push("/dashboard/projects/add");
//   };

//   const handleViewProject = async (projectId: string) => {
//     try {
//       const response = await axios.get(`/api/projects/${projectId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setSelectedProject(response.data.project);

//       // Fetch project tasks after viewing details
//       await fetchProjectsTask(projectId);

//     } catch (error) {
//       console.error("Failed to fetch project details:", error);
//     }
//   };

//   const fetchProjectsTask = async (projectId: string) => {
//     try {
//       const response = await axios.get(`/api/projects/tasks?projectId=${projectId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setSelectedProject((prevProject) =>
//         prevProject
//           ? { ...prevProject, tasks: response.data.data }
//           : prevProject
//       );
//     } catch (error) {
//       console.error("Failed to fetch project tasks:", error);
//     }
//   };

//   const handleAddTask = async () => {
//     if (!selectedProject) return;

//     try {
//       await axios.post(
//         '/api/tasks',
//         {
//           ...newTask,
//           projectId: selectedProject._id,
//           createdBy: user?.id,
//           dueDate: new Date(newTask.dueDate).toISOString()
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       // Refresh project details and tasks after adding a task
//       const updatedProject = await axios.get(`/api/projects/${selectedProject._id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setSelectedProject(updatedProject.data.project);
//       await fetchProjectsTask(selectedProject._id);

//       setNewTask({
//         title: "",
//         description: "",
//         dueDate: "",
//         assignedTo: [],
//         priority: "medium",
//         status: "todo"
//       });
//     } catch (error) {
//       console.error("Failed to add task:", error);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return format(new Date(dateString), 'MMM dd, yyyy');
//   };

//   if (loading) {
//     return <div className="p-6 text-neutral-400">Loading projects...</div>;
//   }

//   return (
//     <div className="space-y-6 p-6 bg-neutral-950 min-h-screen text-neutral-100">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Projects</h1>
//         <Button 
//           onClick={handleAddProject}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white"
//         >
//           <PlusIcon className="mr-2 h-4 w-4" />
//           New Project
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projects.map((project) => (
//           <Card 
//             key={project._id} 
//             className="hover:shadow-lg transition-shadow bg-neutral-900 border-neutral-800 hover:border-emerald-500/30"
//           >
//             <CardHeader>
//               <CardTitle className="text-neutral-100">{project.name}</CardTitle>
//               <CardDescription className="text-neutral-400">
//                 {project.description}
//               </CardDescription>
//               <div className="text-sm text-neutral-500">
//                 Deadline: {formatDate(project.deadline)}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium mb-2 text-neutral-300">
//                     Team Members
//                   </h3>
//                   <div className="flex -space-x-2">
//                     <AnimatedTooltip
//                       items={project.assignedUsers.map(user => ({
//                         id:user._id,
//                         name: user.name,
//                         email: user.email,
//                         image: ""
//                       }))}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button 
//                 variant="outline" 
//                 className="border-neutral-700 text-neutral-300 hover:text-white"
//                 onClick={() => handleViewProject(project._id)}
//               >
//                 View Details
//               </Button>
//               <Button 
//                 className="bg-emerald-600 hover:bg-emerald-700"
//                 onClick={() => {
//                   handleViewProject(project._id);
//                   router.push(`/dashboard/projects/${project._id}`);
//                 }}
//               >
//                 Manage
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {/* Project Details Modal */}
//       {selectedProject && (
//         <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
//           <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-2xl">{selectedProject.name}</DialogTitle>
//               <DialogDescription className="text-neutral-400">
//                 {selectedProject.description}
//               </DialogDescription>
//               <div className="text-sm text-neutral-500">
//                 Deadline: {formatDate(selectedProject.deadline)} | Status: {selectedProject.status}
//               </div>
//             </DialogHeader>

//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Team Members</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedProject.assignedUsers.map(user => (
//                     <div key={user._id} className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full">
//                       <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
//                         {user.name.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <span>{user.name}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium">Tasks</h3>
//                   <Button 
//                     size="sm" 
//                     className="bg-emerald-600 hover:bg-emerald-700"
//                     onClick={() => document.getElementById('new-task-dialog')?.click()}
//                   >
//                     <PlusIcon className="mr-2 h-4 w-4" />
//                     Add Task
//                   </Button>
//                 </div>

//                 {selectedProject.tasks?.length ? (
//                   <div className="space-y-3">
//                     {selectedProject.tasks.map(task => (
//                       <div key={task._id} className="p-4 border border-neutral-800 rounded-lg">
//                         <div className="flex justify-between">
//                           <h4 className="font-medium">{task.title}</h4>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             task.status === 'todo' ? 'bg-blue-500/20 text-blue-400' :
//                             task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
//                             'bg-green-500/20 text-green-400'
//                           }`}>
//                             {task.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-neutral-400 mt-1">{task.description}</p>
//                         <div className="flex justify-between items-center mt-3 text-xs text-neutral-500">
//                           <span>Due: {formatDate(task.dueDate)}</span>
//                           <span className={`${
//                             task.priority === 'high' ? 'text-red-400' :
//                             task.priority === 'medium' ? 'text-yellow-400' :
//                             'text-green-400'
//                           }`}>
//                             {task.priority} priority
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-neutral-500">
//                     No tasks yet. Add your first task!
//                   </div>
//                 )}
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Add Task Dialog */}
//       <Dialog>
//         <DialogTrigger id="new-task-dialog" className="hidden" />
//         <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
//           <DialogHeader>
//             <DialogTitle>Add New Task</DialogTitle>
//             <DialogDescription>
//               Add a new task to {selectedProject?.name}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input 
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                 className="bg-neutral-800 border-neutral-700"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Textarea 
//                 value={newTask.description}
//                 onChange={(e) => setNewTask({...newTask, description: e.target.value})}
//                 className="bg-neutral-800 border-neutral-700"
//                 rows={4}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Due Date</Label>
//                 <Input 
//                   type="date"
//                   value={newTask.dueDate}
//                   onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
//                   className="bg-neutral-800 border-neutral-700"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Priority</Label>
//                 <Select 
//                   value={newTask.priority}
//                   onValueChange={(value) => setNewTask({...newTask, priority: value})}
//                 >
//                   <SelectTrigger className="bg-neutral-800 border-neutral-700">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-neutral-800 border-neutral-700">
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Assign To</Label>
//               <Select 
//                 onValueChange={(value) => {
//                   setNewTask({
//                     ...newTask,
//                     assignedTo: [...newTask.assignedTo, value]
//                   });
//                 }}
//               >
//                 <SelectTrigger className="bg-neutral-800 border-neutral-700">
//                   <SelectValue placeholder="Select team member" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-neutral-800 border-neutral-700">
//                   {selectedProject?.assignedUsers.map(user => (
//                     <SelectItem key={user._id} value={user._id}>
//                       {user.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {newTask.assignedTo.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {newTask.assignedTo.map(userId => {
//                     const user = selectedProject?.assignedUsers.find(u => u._id === userId);
//                     return user ? (
//                       <div key={userId} className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full text-sm">
//                         {user.name}
//                         <button 
//                           onClick={() => setNewTask({
//                             ...newTask,
//                             assignedTo: newTask.assignedTo.filter(id => id !== userId)
//                           })}
//                           className="text-neutral-400 hover:text-white"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <Button 
//                 variant="outline" 
//                 className="border-neutral-700"
//                 onClick={() => document.getElementById('new-task-dialog')?.click()}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 className="bg-emerald-600 hover:bg-emerald-700"
//                 onClick={handleAddTask}
//               >
//                 Add Task
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import { AnimatedTooltip } from "@/app/components/ui/animated-tooltip.tsx";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { PlusIcon, ChevronRightIcon, EllipsisVertical, Trash2, Edit, ListTodo } from "lucide-react";
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
  const { user, token } = useAuthStore();

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