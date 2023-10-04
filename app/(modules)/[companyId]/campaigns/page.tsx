import { AppShell } from '@/components/shell'
import React from 'react'
import CampaignDialog from './_components/campaign-dialog'
import CampaignCharts from './_components/campaign-charts'

export const metadata = {
  title: "Campaigns",
}

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignDialog />
      <CampaignCharts />
    </AppShell>
  )
}
