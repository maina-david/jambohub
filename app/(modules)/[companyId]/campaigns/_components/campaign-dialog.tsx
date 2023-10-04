'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export default function CampaignDialog() {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>
            Choose Campaign Source
          </DialogTitle>
          <DialogDescription>
            Select whether you want to run campaigns using your own customers or the platform&apos;s enrolled customers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <Link href="#">
            <Card className="h-full cursor-pointer shadow-md">
              <CardHeader>
                <CardTitle>
                  Use Your Customers
                </CardTitle>
                <CardDescription>
                  Run targeted campaigns based on your customers&apos; communication channels (e.g., social media accounts).
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>
          </Link>
          <Link href="#">
            <Card className="h-full cursor-pointer shadow-md">
              <CardHeader>
                <CardTitle>
                  Use Platform&apos;s Enrolled Customers
                </CardTitle>
                <CardDescription>
                  Amplify your reach by leveraging the platform&apos;s registered customers for broader campaign distribution.
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
