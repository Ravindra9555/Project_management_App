"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

// UI Components
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { CompanySettingsSkeleton } from "./CompanySettingsSkeleton";

// Icons
import { Building, Save, Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface CompanyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
}

const initialCompanyData: CompanyData = {
  name: "", address: "", city: "", state: "", zipCode: "", phone: "", email: "", website: ""
};

// ===================================
// === COMPANY SETTINGS PAGE COMPONENT ===
// ===================================
export default function CompanySettingsPage() {
  const router = useRouter();
  const { user: authUser, token } = useAuthStore();

  const [formData, setFormData] = useState<CompanyData>(initialCompanyData);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if the user is an admin to control UI elements
  const isAdmin = authUser?.role === 'admin';

  // --- Initial Data Fetching ---
  useEffect(() => {
    // Redirect if user is not part of an organization or doesn't have necessary info
    if (!authUser || authUser.accountType !== 'organization' || !authUser.companyId || !token) {
      if(authUser) { // only redirect if user is loaded but not in a company
        toast.error("You are not part of a company.");
        router.push("/dashboard");
      }
      setLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/company/${authUser.companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Ensure all fields are present, falling back to empty strings
        const fetchedData = { ...initialCompanyData, ...response.data.company };
        setFormData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        toast.error("Could not load company settings.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [authUser, token, router]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !authUser?.companyId) return; // Security check
    
    setIsSubmitting(true);
    try {
      await axios.put(`/api/company/${authUser.companyId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Company settings updated successfully!");
    } catch (error) {
      console.error("Failed to update company settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <CompanySettingsSkeleton />;
  }
  
  // Handle case where user is loaded but has no company
  if (!authUser || authUser.accountType !== 'organization') {
     return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-400">
          This page is only for members of an organization.
        </div>
     )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-neutral-950 min-h-screen text-neutral-100">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="text-neutral-400">
          Manage your organization&#39;s profile, billing, and members.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members" disabled>Members</TabsTrigger>
          <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <form onSubmit={handleSubmit}>
            <Card className="bg-neutral-900 border-neutral-800 mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-emerald-500" />General Information</CardTitle>
                <CardDescription>
                  {isAdmin ? "Update your company's public details." : "View your company's public details."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleFormChange} disabled={!isAdmin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} disabled={!isAdmin} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleFormChange} disabled={!isAdmin} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleFormChange} disabled={!isAdmin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleFormChange} disabled={!isAdmin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleFormChange} disabled={!isAdmin} />
                  </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleFormChange} disabled={!isAdmin} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" type="url" placeholder="https://example.com" value={formData.website} onChange={handleFormChange} disabled={!isAdmin} />
                    </div>
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="border-t border-neutral-800 px-6 py-4 flex justify-end">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}