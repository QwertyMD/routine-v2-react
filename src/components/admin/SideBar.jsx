import React, { useState } from "react";
import { LayoutDashboard, User, Group, ChevronDown, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CalendarClock } from "lucide-react";

function SideBar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Management: true,
  });

  const sideBarSections = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/admin/dashboard",
    },
    {
      label: "Routines",
      icon: <CalendarClock />,
      path: "/admin/routines",
    },
    {
      label: "Issues",
      icon: <AlertTriangle />,
      path: "/admin/issues",
    },
    {
      label: "Teachers",
      icon: <User />,
      path: "/admin/teachers",
    },
    {
      label: "Users",
      icon: <User />,
      path: "/admin/users",
    },
    {
      label: "Misc",
      icon: <Group />,
      items: [
        { label: "Groups", icon: <Group />, path: "/admin/groups" },
        { label: "Modules", icon: <LayoutDashboard />, path: "/admin/modules" },
        { label: "Rooms", icon: <LayoutDashboard />, path: "/admin/rooms" },
      ],
    },
  ];

  const toggleSection = (label) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="py-2 text-center text-lg font-semibold text-sidebar-foreground">
          Admin Panel
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-2 p-2">
          {sideBarSections.map((section) => {
            // If section has items, render dropdown
            if (section.items) {
              const anyChildActive = section.items.some(
                (it) => location.pathname === it.path,
              );
              const isOpen = !!openSections[section.label];

              return (
                <div key={section.label}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`flex h-14 items-center justify-between px-3 text-lg ${
                        anyChildActive
                          ? "bg-pink-50 text-pink-600 hover:bg-pink-50 hover:text-pink-600"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(section.label)}
                        className="flex w-full items-center gap-3"
                      >
                        <span className="flex items-center gap-3">
                          {section.icon}
                          <span>{section.label}</span>
                        </span>
                        <ChevronDown
                          className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                          size={16}
                        />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {isOpen &&
                    section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            className={`h-12 pl-8 text-base ${
                              isActive
                                ? "bg-pink-50 text-pink-600 hover:bg-pink-50 hover:text-pink-600"
                                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            <Link
                              to={item.path}
                              className="flex items-center gap-3"
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                </div>
              );
            }

            // If section has path, render as single link
            const isActive = location.pathname === section.path;
            return (
              <SidebarMenuItem key={section.label}>
                <SidebarMenuButton
                  asChild
                  className={`flex h-14 items-center px-3 text-lg ${
                    isActive
                      ? "bg-pink-50 text-pink-600 hover:bg-pink-50 hover:text-pink-600"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Link
                    to={section.path}
                    className="flex w-full items-center gap-3"
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

export default SideBar;
