'use client'

import { Card, BarChart } from "@tremor/react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const impressionsData = [
  {
    date: "Jan 2023",
    "Impressions": 2488,
  },
  {
    name: "Feb 2023",
    "Impressions": 1445,
  },
  {
    name: "March 2023",
    "Impressions": 743,
  },
]

const expenditureData = [
  {
    date: "Jan 2023",
    "Expenditure": 15000
  },
  {
    date: "Feb 2023",
    "Expenditure": 12400
  },
  {
    date: "March 2023",
    "Expenditure": 7020
  }
]

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
}

const CampaignChats = () => (
  <Tabs defaultValue="impressions">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="impressions">Impressions</TabsTrigger>
      <TabsTrigger value="expenditure">Expenditure</TabsTrigger>
    </TabsList>
    <TabsContent value="impressions">
      <Card>
        <BarChart
          data={impressionsData}
          index="date"
          categories={["impressionsData"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />
      </Card>
    </TabsContent>
    <TabsContent value="expenditure">
      <Card>
        <BarChart
          data={expenditureData}
          index="date"
          categories={["Expenditure"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />
      </Card>
    </TabsContent>
  </Tabs>

)

export default CampaignChats

