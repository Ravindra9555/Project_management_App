"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

// UI Components
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/custom-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/tabel";
import { Label } from "@/app/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch"; // Assuming you have a Switch component
import { MembersPageSkeleton } from "./MembersPageSkeleton";

// Icons
import {  MoreVertical, Trash2, Edit, Search, UserPlus, ShieldAlert, Loader2  } from "lucide-react";

// --- TYPE DEFINITIONS ---
type MemberRole = "engineer" | "worker" | "client" | "admin";
type Member = {
  _id: string;
  name: string;
  email: string;
  role: MemberRole;
  isActive: boolean;
  createdAt: string;
};

// --- CONFIGURATION ---
const roleConfig: Record<MemberRole, { label: string; color: string; }> = {
  admin: { label: "Admin", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  engineer: { label: "Engineer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  worker: { label: "Worker", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  client: { label: "Client", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};
const ROLES: MemberRole[] = ["engineer", "worker", "client"];


// In: app/dashboard/members/page.tsx

// ===================================
// === MEMBER FORM DIALOG COMPONENT (FINAL FIX) ===
// ===================================
function MemberFormDialog({ mode, open, onOpenChange, initialData, onActionSuccess }: {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Member | null;
  onActionSuccess: (member: Member) => void;
}) {
  // ... existing state and handlers ...
 const { token, user: authUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "engineer" as MemberRole, isActive: true });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({ name: initialData.name, email: initialData.email, password: '', role: initialData.role, isActive: initialData.isActive });
    } else {
      setFormData({ name: "", email: "", password: "", role: "engineer", isActive: true });
    }
  }, [initialData, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let response;
      if (mode === 'add') {
        if (!authUser?.companyId) throw new Error("Company ID is missing.");
        response = await axios.post('/api/company/users/register', { ...formData, companyId: authUser.companyId }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Member added successfully!");
      } else if (mode === 'edit' && initialData) {
        const payload = { ...formData, userId: initialData._id, password: formData.password || undefined };
        response = await axios.put('/api/company/users/update', payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Member updated successfully!");
      }
      if (response) {
        onActionSuccess(response.data.user || { ...initialData, ...formData });
      }
      onOpenChange(false);
    } catch (error: unknown) {
      console.error(`Failed to ${mode} member:`, error);
      if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
        // @ts-expect-error: TypeScript can't know the shape here
        toast.error(error.response.data.message || `Could not ${mode} member.`);
      } else {
        toast.error(`Could not ${mode} member.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 
        Key changes:
        1. Removed p-0 from DialogContent to ensure proper padding
        2. Added responsive max-width and width
        3. Simplified the inner layout
      */}
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 sm:max-w-[625px] w-[calc(100%-2rem)]">
        <DialogHeader className="text-left">
          <DialogTitle>{mode === 'add' ? 'Add New Member' : 'Edit Member'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Invite a new person to your company.' : `Update details for ${initialData?.name}.`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {/* 
            Key changes:
            1. Removed fixed max-height and overflow
            2. Added responsive padding
          */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={mode === 'edit'} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder={mode === 'edit' ? 'Leave blank to keep unchanged' : 'Required'} required={mode === 'add'} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as MemberRole })}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {mode === 'edit' && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch id="status" checked={formData.isActive} onCheckedChange={c => setFormData({ ...formData, isActive: c })} />
                    <span className="text-sm">{formData.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        
          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// ===================================
// === MAIN MEMBERS PAGE COMPONENT ===
// ===================================
export default function MembersPage() {
  const { token, user: authUser } = useAuthStore();
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | MemberRole>("all");

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  // Fetch all members on load
  useEffect(() => {
    if (!authUser?.companyId || !token) { setLoading(false); return; }
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/company/users', { companyId: authUser.companyId, role: "all" }, { headers: { Authorization: `Bearer ${token}` } });
        setAllMembers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Could not load company members.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [authUser?.companyId, token]);

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter(m => roleFilter === 'all' || m.role === roleFilter)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allMembers, roleFilter, searchTerm]);

  // Handlers for CRUD actions
  const handleActionSuccess = (updatedOrNewMember: Member) => {
    const memberExists = allMembers.some(m => m._id === updatedOrNewMember._id);
    if (memberExists) {
      setAllMembers(prev => prev.map(m => m._id === updatedOrNewMember._id ? updatedOrNewMember : m));
    } else {
      setAllMembers(prev => [updatedOrNewMember, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    const originalMembers = [...allMembers];
    setAllMembers(prev => prev.filter(m => m._id !== deletingMember._id));
    
    try {
      await axios.delete('/api/company/users/delete', { headers: { Authorization: `Bearer ${token}` }, data: { userId: deletingMember._id } });
      toast.success("Member removed successfully.");
    } catch (error) {
      setAllMembers(originalMembers);
      console.log(error);
      toast.error("Failed to remove member.");
    } finally {
      setDeletingMember(null);
    }
  };

  if (loading) return <div className="p-6 bg-neutral-950 min-h-screen"><MembersPageSkeleton /></div>;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-neutral-950 min-h-screen text-neutral-100">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Company Members</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-950/50"><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:items-center p-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
        <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" /><Input placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-neutral-800 border-neutral-700 pl-10" /></div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as "all" | MemberRole)}><SelectTrigger className="w-full md:w-[180px] bg-neutral-800 border-neutral-700"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem>{Object.keys(roleConfig).map(r => <SelectItem key={r} value={r} className="capitalize">{roleConfig[r as MemberRole].label}</SelectItem>)}</SelectContent></Select>
      </div>

      <div className="border border-neutral-800 rounded-lg">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent border-b-neutral-800"><TableHead>User</TableHead><TableHead>Status</TableHead><TableHead>Role</TableHead><TableHead>Joined On</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? filteredMembers.map(member => (
              <TableRow key={member._id} className="border-b-neutral-800">
                <TableCell><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-emerald-400">{member.name.charAt(0).toUpperCase()}</div><div><div className="font-medium text-neutral-50">{member.name}</div><div className="text-sm text-neutral-400">{member.email}</div></div></div></TableCell>
                <TableCell><Badge variant="outline" className={member.isActive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-neutral-700 bg-neutral-800 text-neutral-400"}>{member.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={roleConfig[member.role]?.color || ""}>{roleConfig[member.role]?.label || member.role}</Badge></TableCell>
                <TableCell className="text-neutral-400">{format(new Date(member.createdAt), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700">
                      <DropdownMenuItem onClick={() => setEditingMember(member)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:text-red-400" onClick={() => setDeletingMember(member)}><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={5} className="text-center h-48 text-neutral-500">No members found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      
      <MemberFormDialog mode="add" open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onActionSuccess={handleActionSuccess} />
      <MemberFormDialog mode="edit" open={!!editingMember} onOpenChange={() => setEditingMember(null)} initialData={editingMember} onActionSuccess={handleActionSuccess} />
      
      <AlertDialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2"><ShieldAlert className="text-red-500"/>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently remove <strong>{deletingMember?.name}</strong> from your company.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Yes, remove member</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}