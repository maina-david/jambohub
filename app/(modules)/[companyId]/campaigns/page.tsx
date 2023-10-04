import { AppShell } from '@/components/shell'
import React from 'react'
import CampaignDialog from './_components/campaign-dialog'
import ImpressionsChart from './_components/impressions-chart'

export const metadata = {
  title: "Campaigns",
}

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignDialog />
      <ImpressionsChart />
    </AppShell>
  )
}
