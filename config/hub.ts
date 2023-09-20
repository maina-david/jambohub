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
      title: "Home",
      href: "/dashboard",
      icon: "home",
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
      title: "ChatFlow",
      href: "/chatflow",
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
