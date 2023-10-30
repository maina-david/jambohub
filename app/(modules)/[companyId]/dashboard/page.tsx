import { Button } from '@/components/ui/button'
import React from 'react'
import { CalendarDateRangePicker } from './_components/date-range-picker'
import DashboardStatsCards from './_components/stats-cards'
import { FilterIcon } from 'lucide-react'

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
            <Button>
              <FilterIcon className='mr-2 h-4 w-4' />
              Filter
            </Button>
          </div>
        </div>
        <DashboardStatsCards />
      </div>
    </div>
  )
}
