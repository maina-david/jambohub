"use client"

import * as React from "react"
import axios from 'axios'
import { Campaign } from "@prisma/client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import CampaignDialog from './_components/campaign-dialog'
import CampaignCharts from './_components/campaign-charts'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CampaignsDataTable } from "./_components/campaigns-table"
import { CampaignProps, columns } from "./_components/columns"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

export default function CampaignsPage() {
  const [isShowingCharts, setIsShowingCharts] = React.useState<boolean>(true)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const params = useParams()
  const campaigns = useQuery({
    queryKey: ['companyCampaigns'],
    queryFn: () => getCompanyCampaigns(params?.companyId as string)
  })

  if (campaigns.isLoading) {
    return (
      <></>
    )
  }

  if (campaigns.isError) {
    return (
      <></>
    )
  }
  console.log(campaigns.data)
  return (
    <>
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <div className="mr-2 flex gap-2">
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
                numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center">
          <Switch
            id="charts-on"
            checked={isShowingCharts}
            onCheckedChange={setIsShowingCharts} />
          <Label htmlFor="charts-on">Display charts</Label>
        </div>
        <div className="ml-auto flex space-x-2 sm:justify-end">
          <CampaignDialog />
        </div>
      </div>
      {isShowingCharts && (
        <CampaignCharts className="space-y-4" />
      )}
      {campaigns.data && <CampaignsDataTable data={campaigns.data} columns={columns} />}
    </>
  )
}

const getCompanyCampaigns = (companyId: string): Promise<CampaignProps[] | undefined> =>
  axios.get(`/api/companies/${companyId}/campaigns`).then((response) => response.data)

