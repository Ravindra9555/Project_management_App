"use client";

import { useAuthStore } from "@/app/store/authStore";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge, Separator, Skeleton } from "@/app/components/ui/custom-ui";
import {
  User,
  Building,
  Mail,
  Crown,
  Zap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  FolderKanban,
} from "lucide-react";

// --- Type Definitions ---

type SubscriptionPlan = {
  _id: string;
  isActive: boolean;
  projectLimit: number;
  type: "free" | "pro" | "enterprise";
  userLimit: number;
};

type ProfileData = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "engineer" | "worker" | "client" | null;
  isActive: boolean;
  subscriptionPlan: SubscriptionPlan | null;
  accountType: "individual" | "organization";
  companyId: string | null;
};

type CompanyData = {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
};

// --- Main Profile Page Component ---

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    if (!token) {
      // It's okay to leave this as is. It handles the case where the user is genuinely logged out.
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }

    const fetchProfileData = async () => {
      try {
        // FIX: Clear previous errors and set loading state for the new fetch attempt.
        setError(null);
        setLoading(true);
        
        // 1. Fetch User Profile
        const profileRes = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) {
          // This will now properly catch real API failures
          throw new Error("Failed to fetch profile data.");
        }
        const userProfile: ProfileData = await profileRes.json();
        setProfileData(userProfile);

        // 2. If user is in a company, fetch company details
        if (userProfile.companyId) {
          const companyRes = await fetch(`/api/company/${userProfile.companyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (companyRes.ok) {
            const companyDetails: CompanyData = await companyRes.json();
            setCompanyData(companyDetails);
          } else {
            console.error("Failed to fetch company details.");
          }
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       setError("Authentication token not found.");
//       return;
//     }

//     const fetchProfileData = async () => {
//       try {
//         setLoading(true);
//         // 1. Fetch User Profile
//         const profileRes = await fetch("/api/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!profileRes.ok) {
//           throw new Error("Failed to fetch profile data.");
//         }
//         const userProfile: ProfileData = await profileRes.json();
//         setProfileData(userProfile);

//         // 2. If user is in a company, fetch company details
//         if (userProfile.companyId) {
//           // IMPORTANT: Replace with your actual API endpoint for company details
//           const companyRes = await fetch(`/api/company/${userProfile.companyId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (!companyRes.ok) {
//             // Don't block the page load, just log the error
//             console.error("Failed to fetch company details.");
//           } else {
//             const companyDetails: CompanyData = await companyRes.json();
//             setCompanyData(companyDetails);
//           }
//         }
//       } catch (err: any) {
//         setError(err.message || "An unknown error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, [token]);

  // Handle Upgrade Button Click (you would navigate to a pricing/checkout page)
  const handleUpgrade = (plan: string) => {
    console.log(`Upgrading to ${plan} plan...`);
    // Example: router.push(`/pricing?plan=${plan}`);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-red-500">
        <p>Error: {error || "Could not load profile."}</p>
      </div>
    );
  }
  
  const showUpgradeSection = 
    (profileData.accountType === 'individual' || profileData.role !== 'admin') &&
    profileData.subscriptionPlan?.type === 'free';

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: User & Company Info --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-200">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-emerald-900/50 border-2 border-emerald-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-emerald-400">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <CardTitle className="text-2xl">{profileData.name}</CardTitle>
              <CardDescription className="text-neutral-400 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" /> {profileData.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="bg-neutral-800 my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-2"><UserCheck className="h-4 w-4"/>Account Type</span>
                  <Badge variant="secondary" className="capitalize bg-neutral-700 text-neutral-200">{profileData.accountType}</Badge>
                </div>
                {profileData.role && (
                   <div className="flex justify-between items-center">
                    <span className="text-neutral-400 flex items-center gap-2"><Briefcase className="h-4 w-4"/>Role</span>
                    <Badge className="capitalize bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">{profileData.role}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {companyData && (
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Building className="h-5 w-5 text-emerald-500"/>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-neutral-300">
                <p className="font-bold text-lg">{companyData.name}</p>
                <p>{companyData.address}, {companyData.city}</p>
                <p>{companyData.website}</p>
                <p>{companyData.email}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* --- Right Column: Subscription & Actions --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Crown className="h-5 w-5 text-emerald-500"/>Subscription Plan</CardTitle>
                <CardDescription className="text-neutral-400">Your current plan details and limits.</CardDescription>
            </CardHeader>
            <CardContent>
                {profileData.subscriptionPlan ? (
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-lg py-1 px-4 capitalize border-emerald-500 text-emerald-400 bg-emerald-900/40">
                            {profileData.subscriptionPlan.type} Plan
                        </Badge>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                                <p className="text-sm text-neutral-400 flex items-center gap-2"><FolderKanban className="h-4 w-4"/>Project Limit</p>
                                <p className="text-2xl font-bold">{profileData.subscriptionPlan.projectLimit}</p>
                            </div>
                             <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                                <p className="text-sm text-neutral-400 flex items-center gap-2"><User className="h-4 w-4"/>User Limit</p>
                                <p className="text-2xl font-bold">{profileData.subscriptionPlan.userLimit}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-neutral-500">No active subscription found.</p>
                )}
            </CardContent>
             {profileData.role === 'admin' && (
                <CardFooter>
                    <div className="w-full p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-300 flex items-center gap-3 text-sm">
                        <ShieldCheck className="h-5 w-5"/>
                        <span>As an admin, you manage the subscription for your entire organization.</span>
                    </div>
                </CardFooter>
            )}
          </Card>

          {showUpgradeSection && (
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><Zap className="h-5 w-5 text-yellow-400"/>Upgrade Your Plan</CardTitle>
                    <CardDescription className="text-neutral-400">Unlock more features and increase your limits.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pro Plan Card */}
                    <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 flex flex-col justify-between hover:border-emerald-500 transition-colors">
                        <div>
                            <h3 className="text-lg font-bold text-emerald-400">Pro Plan</h3>
                            <p className="text-sm text-neutral-400 mt-1">For growing teams and more complex projects.</p>
                        </div>
                        <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleUpgrade('pro')}>
                            Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                    {/* Enterprise Plan Card */}
                     <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 flex flex-col justify-between hover:border-purple-500 transition-colors">
                        <div>
                            <h3 className="text-lg font-bold text-purple-400">Enterprise Plan</h3>
                            <p className="text-sm text-neutral-400 mt-1">For large organizations with advanced needs.</p>
                        </div>
                        <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleUpgrade('enterprise')}>
                            Contact Sales <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

// --- Skeleton Component for Loading State ---

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-950 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader className="text-center">
                            <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 bg-neutral-800" />
                            <Skeleton className="h-8 w-48 mx-auto bg-neutral-800" />
                            <Skeleton className="h-4 w-56 mx-auto mt-2 bg-neutral-800" />
                        </CardHeader>
                        <CardContent>
                            <Separator className="bg-neutral-800 my-4" />
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-full bg-neutral-800" />
                                <Skeleton className="h-6 w-full bg-neutral-800" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 bg-neutral-800" />
                            <Skeleton className="h-4 w-72 mt-2 bg-neutral-800" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Skeleton className="h-8 w-32 bg-neutral-800" />
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <Skeleton className="h-20 w-full bg-neutral-800" />
                                <Skeleton className="h-20 w-full bg-neutral-800" />
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}