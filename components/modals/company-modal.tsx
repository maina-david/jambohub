"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCompanyModal } from "@/hooks/use-company-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"

let SubscriptionPlans = [
  {
    label: (
      <span className="font-medium">
        Free - <span className="text-muted-foreground">Trial for two weeks</span>
      </span>
    ),
    value: "free",
  },
  {
    label: (
      <span className="font-medium">
        Pro - <span className="text-muted-foreground">KES 1500/month per user</span>
      </span>
    ),
    value: "pro",
  },
]

const formSchema = z.object({
  name: z.string().min(1),
  plan: z.enum(["free", "pro"]),
  defaultCompany: z.boolean()
})

export const CompanyModal = () => {
  const companyModal = useCompanyModal()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      plan: undefined,
      defaultCompany: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/companies', {
        ...values,
      })
      window.location.assign(`/${response.data.id}`)
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your company was not created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onChange = (open: boolean) => {
    if (!open) {
      companyModal.onClose()
    }
  }

  return (
    <Dialog open={companyModal.isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create company</DialogTitle>
          <DialogDescription>
            Add a new company to manage channels and teams.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your company display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription plan</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {SubscriptionPlans.map((plan) => (
                            <SelectItem key={plan.value} value={plan.value}>
                              {plan.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="defaultCompany"
                  render={() => (
                    <FormItem>
                      <FormLabel
                        htmlFor="defaultCompany"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Set as default?
                      </FormLabel>
                      <FormControl>
                        <Checkbox id="defaultCompany" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button disabled={loading} variant="outline" onClick={companyModal.onClose}>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}
