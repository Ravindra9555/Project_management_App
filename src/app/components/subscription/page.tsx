"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

// UI Components
import { BackgroundBeams } from "../ui/background-beams";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Icons
import { Check, Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
type Plan = "free" | "pro" | "enterprise";
type UserType = "individual" | "organization";
interface CompanyData { name: string; email: string; }

// --- CONFIGURATION FOR PLANS ---
const plans = [
  { id: "free" as Plan, name: "Free", description: "For individuals and hobby projects.", price: "₹0", features: ["Up to 3 projects", "5 members per project", "Basic support"], isPopular: false, availableFor: ["individual", "organization"] as UserType[] },
  { id: "pro" as Plan, name: "Pro", description: "For professionals and small teams.", price: "₹99.00", features: ["Up to 50 projects", "20 members per project", "Priority support", "Advanced features"], isPopular: true, availableFor: ["individual", "organization"] as UserType[] },
  { id: "enterprise" as Plan, name: "Enterprise", description: "For large-scale organizations.", price: "Custom", features: ["Unlimited projects", "Unlimited members", "Dedicated support", "SSO & Security"], isPopular: false, availableFor: ["organization"] as UserType[] },
];

// =================================
// === PLAN CARD COMPONENT (Enhanced) ===
// =================================
const PlanCard = ({ plan, isSelected, onSelect }: { plan: typeof plans[0]; isSelected: boolean; onSelect: () => void; }) => (
  <div className={cn("relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-8 transition-all duration-300", isSelected ? "border-emerald-500 ring-2 ring-emerald-500/50" : "hover:border-neutral-700")}>
    {plan.isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-neutral-400 mb-6 min-h-[40px]">{plan.description}</p>
      <div className="text-4xl font-bold text-white mb-6">{plan.price}<span className="text-lg text-neutral-400">/month</span></div>
      <ul className="space-y-3 mb-8">
        {plan.features.map(feature => <li key={feature} className="flex items-center text-neutral-300"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />{feature}</li>)}
      </ul>
    </div>
    <Button onClick={onSelect} className={cn("w-full text-base py-6", isSelected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-800 hover:bg-neutral-700 text-white")}>
      {isSelected ? <><Check className="mr-2 h-5 w-5" /> Selected</> : "Select Plan"}
    </Button>
  </div>
);

// =================================
// === COMPANY FORM COMPONENT (Fixed) ===
// =================================
const CompanyForm = ({ companyData, onCompanyDataChange }: { companyData: CompanyData; onCompanyDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mt-12 p-8 bg-neutral-900 rounded-xl border border-neutral-800">
    <h2 className="text-2xl font-bold text-neutral-100 mb-6">Company Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2"><Label htmlFor="name">Company Name</Label><Input id="name" name="name" value={companyData.name} onChange={onCompanyDataChange} required className="bg-neutral-800 border-neutral-700" /></div>
      <div className="space-y-2"><Label htmlFor="email">Company Email</Label><Input id="email" name="email" type="email" value={companyData.email} onChange={onCompanyDataChange} required className="bg-neutral-800 border-neutral-700" /></div>
    </div>
  </motion.div>
);

// =================================
// === MAIN SUBSCRIPTION PAGE (Refactored) ===
// =================================
export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [userType, setUserType] = useState<UserType>("individual");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({ name: "", email: "" });

  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (userType === 'organization' && (!companyData.name || !companyData.email)) {
        toast.error("Please fill in company name and email.");
        return;
    }
    
    setIsSubmitting(true);
    const payload = { userId: user?.id, type: selectedPlan, accountType: userType, ...(userType === "organization" && { companyData }) };

    try {
      const response = await axios.post("/api/plan/select", payload);
      toast.success(response.data.message || "Subscription successful!");
      if (response.status === 200) {
      // Update the auth store with new subscription info
      useAuthStore.setState({
        user: {
          ...user,
          id: user?.id ?? "",
          name: user?.name ?? "",
          email: user?.email ?? "",
          role: user?.role ?? null,
          companyId:  response?.data?.plan?.companyId ?? null,
          isActive:  response?.data?.plan?.isActive ?? false,
          subscriptionPlan: response?.data?.plan?._id,
          accountType: userType,
        },
      });
      }
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Subscription failed.");
      } else {
        toast.error("Subscription failed.");
      }
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
    };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950">
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      {/* --- FIX: Main Content Wrapper --- */}
      {/* This single container provides max-width, centering, and responsive padding for the entire page */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-12">
            Select whether you&apos;re signing up as an individual or for your organization.
          </p>
        </motion.div>

        {/* User Type Toggle Section */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex justify-center mb-16">
          <div className="flex p-1.5 bg-neutral-800/80 border border-neutral-700 rounded-full backdrop-blur-sm">
            <Button
              onClick={() => setUserType("individual")}
              className={cn("w-36 sm:w-40 rounded-full", userType === "individual" ? "bg-emerald-600 text-white" : "bg-transparent text-neutral-300 hover:bg-neutral-700")}
              variant="ghost"
            >
              For Individuals
            </Button>
            <Button
              onClick={() => setUserType("organization")}
              className={cn("w-36 sm:w-40 rounded-full", userType === "organization" ? "bg-emerald-600 text-white" : "bg-transparent text-neutral-300 hover:bg-neutral-700")}
              variant="ghost"
            >
              For Organizations
            </Button>
          </div>
        </motion.div>
        
        {/* Pricing Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence>
            {plans
              .filter(p => p.availableFor.includes(userType))
              .map((plan, i) => (
                <motion.div
                  key={`${userType}-${plan.id}`} // Key change ensures re-render on userType switch
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <PlanCard
                    plan={plan}
                    isSelected={selectedPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.id)}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Company Form Section */}
        <AnimatePresence>
          {userType === "organization" && (
            <CompanyForm companyData={companyData} onCompanyDataChange={handleCompanyDataChange} />
          )}
        </AnimatePresence>
        
        {/* Final Submission Button */}
        <div className="mt-16 text-center">
          <Button size="lg" className="px-10 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-950/50" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Complete Subscription"}
          </Button>
        </div>
        
      </main>
    </div>
  );
}