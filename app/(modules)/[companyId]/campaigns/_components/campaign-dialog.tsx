'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export default function CampaignDialog() {
    return (
        <Dialog defaultOpen={true}>
            <DialogHeader>
                <DialogTitle>
                    Choose Campaign Source
                </DialogTitle>
                <DialogDescription>
                    Select whether you want to run campaigns using your own customers or the platform&apos;s enrolled customers.
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <div className="grid grid-cols-2 gap-2">
                    <Link href="#">
                        <Card className="cursor-pointer shadow-md">
                            <CardHeader>
                                <CardTitle>
                                    Use Your Customers
                                </CardTitle>
                                <CardDescription>
                                    Run campaigns targeting your own customers who have linked their social media accounts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="#">
                        <Card className="cursor-pointer shadow-md">
                            <CardHeader>
                                <CardTitle>
                                    Use Platform&apos;s Enrolled Customers
                                </CardTitle>
                                <CardDescription>
                                    Utilize the platform&apos;s enrolled customers who have linked their social media accounts for your campaigns.
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
