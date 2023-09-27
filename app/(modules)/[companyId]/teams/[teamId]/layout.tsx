import { Metadata } from "next"
import { TeamSidebarNav } from "../_component/team-sidenav"
import TeamHeader from "../_component/team-header"
import { AppShell } from '@/components/shell'
import { validateCompanyTeam } from "@/lib/session"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Team",
}

interface TeamLayoutProps {
  children: React.ReactNode,
  params: { companyId: string, teamId: string }
}

export default async function TeamLayout({ children, params }: TeamLayoutProps) {
  const verifyTeam = await validateCompanyTeam(params.companyId, params.teamId)

  if (!verifyTeam) {
    return notFound()
  }
  return (
    <AppShell>
      <TeamHeader />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <TeamSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </AppShell>
  )
}
