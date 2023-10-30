import { Button } from '@/components/ui/button'
import React from 'react'
import { CalendarDateRangePicker } from './_components/date-range-picker'
import DashboardStatsCards from './_components/stats-cards'

export const metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className='flex flex-col'>
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <DashboardStatsCards />
      </div>
    </div>
  )
}
