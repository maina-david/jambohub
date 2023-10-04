import { AppShell } from '@/components/shell'
import React from 'react'
import CampaignDialog from './_components/campaign-dialog'
import CampaignChats from './_components/campaign-chats'

export const metadata = {
  title: "Campaigns",
}

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignDialog />
      <CampaignChats />
    </AppShell>
  )
}
