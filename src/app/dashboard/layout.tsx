"use client";
import React, {  useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  
  IconBrandCodesandbox,
  IconUsers
} from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";
import { Logo, LogoIcon } from "@/app/components/ui/logo"; 
import { useAuthStore } from "../store/authStore";
// import { Button } from "../components/ui/button";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  const { user , logout} = useAuthStore();


  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: (
        <IconBrandCodesandbox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // Only show Members and Settings if user.userTpe is not 'individual'
    ...(user?.accountType !== "individual"
      ? [
          {
            label: "Members",
            href: "/dashboard/members",
            icon: (
              <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
          },
          {
            label: "Settings",
            href: "/dashboard/setting/company",
            icon: (
              <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
          },
        ]
      : []),
    {
      label: "Logout",
      href: "/",
      onClick: () => {
        logout();
      },
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-950",
        "h-dvh"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-neutral-700 dark:text-neutral-200"
              onClick={() => {
                logout();
              }}
            > Logout</Button>     */}
            <SidebarLink
              link={{
                label: user?.email || "Profile",
                href: "/dashboard/profile",
                icon: (
                  <img
                    // src="https://assets.aceternity.com/manu.png"

                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto p-6 md:p-6 bg-neutral-950 dark:bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
