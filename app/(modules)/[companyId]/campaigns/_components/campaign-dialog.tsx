'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useState } from "react"

export default function CampaignDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
        variant={'default'}
        onClick={() => setIsOpen(true)}
        >
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-screen-md">
        <DialogHeader>
          <DialogTitle>
            Choose Campaign Source
          </DialogTitle>
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
