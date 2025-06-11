// "use client";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import { Textarea } from "@/app/components/ui/textarea";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/app/store/authStore";
// import { useState, useEffect } from "react";
// import { Calendar } from "@/app/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";

// type User = {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
// };

// export default function NewProjectPage() {
//     const router = useRouter();
//     const authUser = useAuthStore((state) => state.user);
//     const token = useAuthStore((state) => state.token);
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         assignedUsers: [] as string[],
//         deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default to 1 month from now
//     });
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [userLoading, setUserLoading] = useState(false);

//     // Fetch company users
//     useEffect(() => {
//         const fetchCompanyUsers = async () => {
//             if (!authUser?.companyId || !token) return;

//             try {
//                 setUserLoading(true);
//                 const response = await fetch('/api/company/users', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({
//                         companyId: authUser.companyId,
//                         role: "engineer" // Get all users
//                     })
//                 });
//                 const data = await response.json();
//                 setUsers(data.users);
//             } catch (error) {
//                 console.error("Failed to fetch company users:", error);
//             } finally {
//                 setUserLoading(false);
//             }
//         };

//         fetchCompanyUsers();
//     }, [authUser, token]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await fetch('/api/projects/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     description: formData.description,
//                     assignedUsers: formData.assignedUsers,
//                     deadline: format(formData.deadline, 'yyyy-MM-dd')
//                 })
//             });

//             if (response.ok) {
//                 router.push("/dashboard/projects");
//             } else {
//                 console.error("Failed to create project");
//             }
//         } catch (error) {
//             console.error("Error creating project:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleUserAssignment = (userId: string) => {
//         setFormData(prev => ({
//             ...prev,
//             assignedUsers: prev.assignedUsers.includes(userId)
//                 ? prev.assignedUsers.filter(id => id !== userId)
//                 : [...prev.assignedUsers, userId]
//         }));
//     };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-neutral-950 text-neutral-100">
//       <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <Label htmlFor="name">Project Name</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) => setFormData({...formData, name: e.target.value})}
//             required
//             className="bg-neutral-800 border-neutral-700"
//           />
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) => setFormData({...formData, description: e.target.value})}
//             rows={5}
//             className="bg-neutral-800 border-neutral-700"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label>Deadline</Label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
//               <Calendar
//                 mode="single"
//                 selected={formData.deadline}
//                 onSelect={(date: Date | undefined) => date && setFormData({...formData, deadline: date})}
//                 initialFocus
//                 className="bg-neutral-800"
//               />
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div className="space-y-2">
//           <Label>Assign Team Members</Label>
//           {userLoading ? (
//             <div className="text-neutral-400">Loading team members...</div>
//           ) : (
//             <div className="space-y-3">
//               <Select
//                 onValueChange={(userId) => toggleUserAssignment(userId)}
//               >
//                 <SelectTrigger className="bg-neutral-800 border-neutral-700">
//                   <SelectValue placeholder="Select team members" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-neutral-800 border-neutral-700">
//                   {users.map((user) => (
//                     <SelectItem 
//                       key={user._id} 
//                       value={user._id}
//                       disabled={formData.assignedUsers.includes(user._id)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
//                           {user.name.split(' ').map(n => n[0]).join('')}
//                         </div>
//                         <span>{user.name}</span>
//                         <span className="text-xs text-neutral-400 ml-auto">{user.role}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {formData.assignedUsers.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {formData.assignedUsers.map(userId => {
//                     const user = users.find(u => u._id === userId);
//                     return user ? (
//                       <div 
//                         key={userId} 
//                         className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full"
//                       >
//                         <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
//                           {user.name.split(' ').map(n => n[0]).join('')}
//                         </div>
//                         <span>{user.name}</span>
//                         <button 
//                           type="button"
//                           onClick={() => toggleUserAssignment(userId)}
//                           className="ml-2 text-neutral-400 hover:text-white"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-4 pt-4">
//           <Button 
//             type="button" 
//             variant="outline"
//             className="border-neutral-700"
//             onClick={() => router.push("/dashboard/projects")}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit"
//             className="bg-emerald-600 hover:bg-emerald-700"
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Create Project"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useState, useEffect } from "react";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, Users } from "lucide-react";

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
};

const USER_ROLES = ["engineer", "worker", "client"];

export default function NewProjectPage() {
    const router = useRouter();
    const authUser = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        assignedUsers: [] as string[],
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    // --- STATE CHANGES START HERE ---
    // This state holds ALL users ever fetched, to prevent "forgetting" users when the role filter changes.
    const [allKnownUsers, setAllKnownUsers] = useState<User[]>([]);
    // This state holds only the users for the currently selected role, to populate the dropdown.
    const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
    // --- STATE CHANGES END HERE ---

    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("engineer");

    useEffect(() => {
        const fetchCompanyUsers = async () => {
            if (!authUser?.companyId || !token) return;

            // Optimization: If we've already fetched users for this role, don't fetch again.
            const roleAlreadyFetched = allKnownUsers.some(user => user.role === selectedRole);
            if(roleAlreadyFetched) {
                setDisplayedUsers(allKnownUsers.filter(user => user.role === selectedRole));
                return;
            }

            try {
                setUserLoading(true);
                const response = await fetch('/api/company/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ companyId: authUser.companyId, role: selectedRole })
                });
                const data = await response.json();
                const newUsers = data.users || [];

                // --- LOGIC CHANGE START HERE ---
                // Set the dropdown list to only the newly fetched users.
                setDisplayedUsers(newUsers);

                // Add the newly fetched users to our master list, avoiding duplicates.
                setAllKnownUsers(prevKnownUsers => {
                    const knownUserIds = new Set(prevKnownUsers.map(u => u._id));
                    const uniqueNewUsers = newUsers.filter((u: User) => !knownUserIds.has(u._id));
                    return [...prevKnownUsers, ...uniqueNewUsers];
                });
                // --- LOGIC CHANGE END HERE ---

            } catch (error) {
                console.error("Failed to fetch company users:", error);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCompanyUsers();
    }, [authUser, token, selectedRole]); // This effect still runs when the role changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    assignedUsers: formData.assignedUsers,
                    deadline: format(formData.deadline, 'yyyy-MM-dd')
                })
            });
            if (response.ok) router.push("/dashboard/projects");
            else console.error("Failed to create project");
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserAssignment = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedUsers: prev.assignedUsers.includes(userId)
                ? prev.assignedUsers.filter(id => id !== userId)
                : [...prev.assignedUsers, userId]
        }));
    };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl shadow-emerald-950/20">
        <div className="p-6 border-b border-neutral-800">
            <h1 className="text-2xl font-bold text-neutral-100">Create New Project</h1>
            <p className="text-sm text-neutral-400 mt-1">Fill in the details below to start a new project.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                {/* Project Name, Description, and Deadline fields remain the same */}
                <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} className="bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500"/>
                </div>
                <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 hover:bg-neutral-700/80 hover:text-white">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
                            <Calendar mode="single" selected={formData.deadline} onSelect={(date) => date && setFormData({...formData, deadline: date})} initialFocus className="bg-neutral-800"/>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-4 rounded-lg border border-neutral-800 p-4">
                    <h3 className="font-semibold text-neutral-200 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-500" /> Assign Team Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Select Role</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="bg-neutral-800 border-neutral-700"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-800 border-neutral-700">
                                    {USER_ROLES.map(role => (<SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Add Users</Label>
                            <Select onValueChange={(userId) => userId && toggleUserAssignment(userId)} value="">
                                <SelectTrigger className="bg-neutral-800 border-neutral-700">
                                    <SelectValue placeholder={userLoading ? "Loading..." : "Select from list"} />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-800 border-neutral-700">
                                {/* --- JSX CHANGE: Map over displayedUsers --- */}
                                {displayedUsers.length > 0 ? displayedUsers.map((user) => (
                                    <SelectItem key={user._id} value={user._id}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs text-white font-bold">{user.name.split(' ').map(n => n[0]).join('')}</div>
                                                <span>{user.name}</span>
                                            </div>
                                            {formData.assignedUsers.includes(user._id) && <Check className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                    </SelectItem>
                                )) : <div className="p-2 text-sm text-neutral-400">No {selectedRole}s found.</div>}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.assignedUsers.length > 0 && (
                        <div className="pt-4 border-t border-neutral-800 mt-4">
                            <Label className="text-neutral-300">Currently Assigned:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* --- JSX CHANGE: Find user in allKnownUsers --- */}
                                {formData.assignedUsers.map(userId => {
                                    const user = allKnownUsers.find(u => u._id === userId);
                                    return user ? (
                                    <div key={userId} className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full text-sm">
                                        <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center text-xs text-white font-bold">{user.name.split(' ').map(n => n[0]).join('')}</div>
                                        <span className="font-medium text-neutral-200">{user.name}</span>
                                        <span className="text-xs text-neutral-400 capitalize">({user.role})</span>
                                        <button type="button" onClick={() => toggleUserAssignment(userId)} className="ml-1.5 text-neutral-500 hover:text-white">×</button>
                                    </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 p-6 bg-neutral-900/50 border-t border-neutral-800 rounded-b-xl">
                <Button type="button" variant="outline" className="border-neutral-700 hover:bg-neutral-800" onClick={() => router.push("/dashboard/projects")} disabled={loading}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading || !formData.name}>
                    {loading ? "Creating..." : "Create Project"}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}