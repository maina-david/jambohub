import React from 'react'
import { AppShell } from '@/components/shell'
import { AppHeader } from '@/components/header'

export const metadata = {
  title: "Team",
}

export default async function TeamPage() {

  return (
    <AppShell>
      <AppHeader heading='Team' text='Manage team'>
      </AppHeader>
    </AppShell>
  )
}
