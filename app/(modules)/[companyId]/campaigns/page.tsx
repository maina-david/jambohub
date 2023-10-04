"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import CampaignDialog from './_components/campaign-dialog'
import CampaignCharts from './_components/campaign-charts'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CampaignsDataTable } from "./_components/campaigns-table"
import { columns } from "./_components/columns"

export default function CampaignsPage() {
  const [isShowingCharts, setIsShowingCharts] = React.useState<boolean>(true)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  return (
    <>
      <div className="flex items-start justify-between space-y-4">
        <div className="flex-1 gap-4">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid items-center">
            <Switch
              id="charts-on"
              checked={isShowingCharts}
              onCheckedChange={setIsShowingCharts} />
            <Label htmlFor="charts-on">Display charts</Label>
          </div>
        </div>
        <div className="ml-auto">
          <CampaignDialog />
        </div>
      </div>
      {isShowingCharts && (
        <CampaignCharts className="space-y-4" />
      )}
      <CampaignsDataTable data={[]} columns={columns} />
    </>
  )
}
