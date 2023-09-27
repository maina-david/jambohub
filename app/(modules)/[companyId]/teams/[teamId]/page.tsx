import React from 'react'
import { AppShell } from '@/components/shell'
import { Separator } from '@/components/ui/separator'
import TeamHeader from '../_component/team-header'

export const metadata = {
  title: "Team",
}

export default async function TeamPage() {

  return (
    <AppShell>
      <TeamHeader />
    </AppShell>
  )
}
