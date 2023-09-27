import { Metadata } from "next"
import { TeamSidebarNav } from "../_component/team-sidenav"
import TeamHeader from "../_component/team-header"
import { AppShell } from '@/components/shell'

export const metadata: Metadata = {
  title: "Team",
}

interface TeamLayoutProps {
  children: React.ReactNode
}

export default function TeamLayout({ children }: TeamLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Members",
      href: '/members',
    },
    {
      title: "Pending",
      href: '/pending',
    },
    {
      title: "Settings",
      href: '/settings',
    },
  ]
  return (
    <AppShell>
      <TeamHeader />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <TeamSidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </AppShell>
  )
}
