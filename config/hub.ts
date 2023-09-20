import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
      disabled: true,
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Chats",
      href: "/chats",
      icon: "chat",
    },
    {
      title: "Campaigns",
      href: "/campaigns",
      icon: "campaign",
    },
    {
      title: "Leads",
      href: "/leads",
      icon: "activity",
    },
    {
      title: "ChatFlows",
      href: "/chatflows",
      icon: "flow",
    },
    {
      title: "Channels",
      href: "/channels",
      icon: "channels",
    },
    {
      title: "Teams",
      href: "/teams",
      icon: "user"
    },
  ],
}
