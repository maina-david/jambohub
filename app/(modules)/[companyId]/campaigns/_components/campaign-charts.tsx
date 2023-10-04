'use client'

import { BarChart } from "@tremor/react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

const impressionsData = [
  {
    date: "Jan 2023",
    Impressions: 3456,
  },
  {
    date: "Feb 2023",
    Impressions: 5432,
  },
  {
    date: "Mar 2023",
    Impressions: 6789,
  },
  {
    date: "Apr 2023",
    Impressions: 7890,
  },
  {
    date: "May 2023",
    Impressions: 4567,
  },
  {
    date: "Jun 2023",
    Impressions: 6543,
  },
  {
    date: "Jul 2023",
    Impressions: 9876,
  },
  {
    date: "Aug 2023",
    Impressions: 3456,
  },
  {
    date: "Sep 2023",
    Impressions: 8765,
  },
  {
    date: "Oct 2023",
    Impressions: 2345,
  },
  {
    date: "Nov 2023",
    Impressions: 5678,
  },
  {
    date: "Dec 2023",
    Impressions: 1234,
  },
]

const expenditureData = [
  {
    date: "Jan 2023",
    Expenditure: 15000,
  },
  {
    date: "Feb 2023",
    Expenditure: 12400,
  },
  {
    date: "Mar 2023",
    Expenditure: 7020,
  },
  {
    date: "Apr 2023",
    Expenditure: 8900,
  },
  {
    date: "May 2023",
    Expenditure: 4560,
  },
  {
    date: "Jun 2023",
    Expenditure: 6540,
  },
  {
    date: "Jul 2023",
    Expenditure: 9870,
  },
  {
    date: "Aug 2023",
    Expenditure: 3450,
  },
  {
    date: "Sep 2023",
    Expenditure: 8760,
  },
  {
    date: "Oct 2023",
    Expenditure: 2340,
  },
  {
    date: "Nov 2023",
    Expenditure: 5670,
  },
  {
    date: "Dec 2023",
    Expenditure: 1230,
  },
]

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
}

const CampaignCharts = () => (
  <Tabs defaultValue="impressions" className="w-[400px]">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="impressions">Impressions</TabsTrigger>
      <TabsTrigger value="expenditure">Expenditure</TabsTrigger>
    </TabsList>
    <TabsContent value="impressions">
      <Card className="dark:text-white">
        <BarChart
          data={impressionsData}
          index="date"
          categories={["Impressions"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
        />
      </Card>
    </TabsContent>
    <TabsContent value="expenditure">
      <Card className="dark:text-white">
        <BarChart
          data={expenditureData}
          index="date"
          categories={["Expenditure"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
        />
      </Card>
    </TabsContent>
  </Tabs>

)

export default CampaignCharts
