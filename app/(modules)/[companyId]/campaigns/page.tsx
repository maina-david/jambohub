import { AppShell } from '@/components/shell'
import React from 'react'
import CampaignDialog from './_components/campaign-dialog'
import CampaignCharts from './_components/campaign-charts'
import { Search } from '@/components/search'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: "Campaigns",
}

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignDialog />
      <div className="flex items-center justify-between px-2">
        <Search />
        <Button className='ghost'>
          Search
        </Button>
      </div>
      <CampaignCharts />
    </AppShell>
  )
}
