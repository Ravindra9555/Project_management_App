"use client";
import { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Router from "next/router";
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

interface SubscriptionData {
  userId?: string;
  type: "free" | "pro" | "enterprise";
  accountType: "individual" | "organization";
  companyData?: CompanyData;
}

export default function SubscriptionPage() {
  const { user } = useAuthStore();
 const router = Router;
  const [userType, setUserType] = useState<"individual" | "organization">(
    "individual"
  );
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "pro" | "enterprise"
  >("free");

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
  });

  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value);
  };

  const handleSubmit = async () => {
    const subscriptionData: SubscriptionData = {
      userId: user?.id,
      type: selectedPlan,
      accountType: userType,
      ...(userType === "organization" && { companyData }),
    };

    try {
      const response = await axios.post("/api/plan/select", subscriptionData);
      if (response.status === 200) {
        toast.success("Subscription successful");
        router.push("/dashboard");
      }
      console.log("Subscription successful");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Subscription failed");
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    }
  };


  return (
    <div className="relative min-h-screen w-full bg-neutral-950 pt-24 pb-12">
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 mb-8">
          Choose Your Plan
        </h1>

        <div className="flex flex-col items-center mb-12">
          <Tabs
            defaultValue="individual"
            className="w-[400px]"
            onValueChange={(value: string) =>
              setUserType(value as "individual" | "organization")
            }
          >
            <TabsList className="grid w-full grid-cols-2 bg-neutral-900">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          {/* Free Plan */}
          <CardContainer className="inter-var flex-1">
            <CardBody className="bg-neutral-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-100"
              >
                Free
                <span className="text-sm text-neutral-400 block mt-1">
                  $0/month
                </span>
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-300 text-sm max-w-sm mt-2"
              >
                Perfect for getting started
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4 flex-grow">
                <ul className="text-neutral-400 text-sm space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Basic features
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    5GB storage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Community support
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem translateZ={20}>
                  <Button
                    variant={selectedPlan === "free" ? "default" : "outline"}
                    onClick={() => setSelectedPlan("free")}
                    className="w-full"
                  >
                    {selectedPlan === "free" ? "Selected" : "Select"}
                  </Button>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          {/* Pro Plan */}
          <CardContainer className="inter-var flex-1">
            <CardBody className="bg-neutral-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-100"
              >
                Pro
                <span className="text-sm text-neutral-400 block mt-1">
                  $9.99/month
                </span>
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-300 text-sm max-w-sm mt-2"
              >
                For power users and professionals
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4 flex-grow">
                <ul className="text-neutral-400 text-sm space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    All Free features
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    50GB storage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Advanced analytics
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem translateZ={20}>
                  <Button
                    variant={selectedPlan === "pro" ? "default" : "outline"}
                    onClick={() => setSelectedPlan("pro")}
                    className="w-full"
                  >
                    {selectedPlan === "pro" ? "Selected" : "Select"}
                  </Button>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          {/* Enterprise Plan - Only for Organizations */}
          {userType === "organization" && (
            <CardContainer className="inter-var flex-1">
              <CardBody className="bg-neutral-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-100"
                >
                  Enterprise
                  <span className="text-sm text-neutral-400 block mt-1">
                    Custom pricing
                  </span>
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-300 text-sm max-w-sm mt-2"
                >
                  For businesses and large teams
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4 flex-grow">
                  <ul className="text-neutral-400 text-sm space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      All Pro features
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Unlimited storage
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      24/7 dedicated support
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Custom solutions
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      SSO & advanced security
                    </li>
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem translateZ={20}>
                    <Button
                      variant={
                        selectedPlan === "enterprise" ? "default" : "outline"
                      }
                      onClick={() => setSelectedPlan("enterprise")}
                      className="w-full"
                    >
                      {selectedPlan === "enterprise" ? "Selected" : "Select"}
                    </Button>
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          )}
        </div>
        {/* Company Details Form - Only shown for Enterprise Organizations */}
        {userType === "organization" && (
          <div className="mt-12 p-8 bg-neutral-900 rounded-xl border border-neutral-800">
            <h2 className="text-2xl font-bold text-neutral-100 mb-6">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={companyData.name}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={companyData.city}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={companyData.state}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={companyData.zipCode}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={companyData.email}
                  onChange={handleCompanyDataChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={companyData.website}
                  onChange={handleCompanyDataChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
            onClick={handleSubmit}
          >
            Complete Subscription
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
