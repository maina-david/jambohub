import React from 'react'

import { AppShell } from '@/components/shell'
import { AppHeader } from '@/components/header'
import TeamModal from './_component/team-modal'

export const metadata = {
  title: "Teams",
}

function TeamsPage() {
  return (
    <AppShell>
      <AppHeader heading='Company Teams' text='Manage teams and their members'>
        <TeamModal />
      </AppHeader>


    </AppShell>
  )
}

export default TeamsPage
