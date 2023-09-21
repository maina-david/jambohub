"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCompanyModal } from "@/hooks/use-company-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"

const formSchema = z.object({
  name: z.string().min(1),
  plan: z.string().min(1),
  defaultCompany: z.boolean()
})

export const CompanyModal = () => {
  const companyModal = useCompanyModal()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      plan: "",
      defaultCompany: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/companies', values)
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

  return (
    <Modal
      title="Create company"
      description="Add a new company to manage channels and teams."
      isOpen={companyModal.isOpen}
      onClose={companyModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
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
                              <SelectItem value="free">
                                <span className="font-medium">Free</span> -{" "}
                                <span className="text-muted-foreground">
                                  Trial for two weeks
                                </span>
                              </SelectItem>
                              <SelectItem value="pro">
                                <span className="font-medium">Pro</span> -{" "}
                                <span className="text-muted-foreground">
                                  KES 1500/month per user
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultCompany"
                    render={() => (
                      <FormItem>
                        <FormLabel>Set as default?</FormLabel>
                        <FormControl>
                          <Checkbox checked={false} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button disabled={loading} variant="outline" onClick={companyModal.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
