"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import PhoneInput from 'react-phone-number-input'
import { toast } from "@/components/ui/use-toast"
import { useState, useMemo } from "react"
import countryList from 'react-select-country-list'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCompanyModal } from "@/hooks/use-company-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "../icons"
import { ToastAction } from "../ui/toast"
import { companySchema } from "@/lib/validations/company"
import { ScrollArea } from "../ui/scroll-area"

export const CompanyModal = () => {
  const companyModal = useCompanyModal()
  const [loading, setLoading] = useState(false)
  const countryOptions = useMemo(() => countryList().getData(), []);

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof companySchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/companies', {
        ...values,
      })
      toast({
        title: "Success",
        description: "Your company was created successfully!",
      })
      window.location.assign(`/${response.data.id}/dashboard`)
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status
        if (status === 402) {
          toast({
            title: "Requires Pro Plan",
            description: "You need a Pro Plan to create more companies.",
            variant: "destructive",
            action: <ToastAction altText="Upgrade now">Upgrade now</ToastAction>,
          })
        } else if (status === 403) {
          toast({
            title: "Exceeded Maximum Company Limit",
            description: "You've reached the maximum company limit for your plan.",
            variant: "destructive",
          })
        } else if (status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data
          toast({
            title: "Validation Error",
            description: "Please correct the following errors: " + validationErrors.join(", "),
            variant: "destructive",
          })
        } else {
          // Handle other unexpected errors
          toast({
            title: "Something went wrong.",
            description: "Your company was not created. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // Handle other unexpected errors
        toast({
          title: "Something went wrong.",
          description: "Your company was not created. Please try again.",
          variant: "destructive",
        })
      }
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
    <Dialog open={companyModal.isOpen} onOpenChange={onChange} modal>
      <DialogContent className="h-[80vh] w-[70vw]">
        <ScrollArea className="h-full w-full">
          <DialogHeader>
            <DialogTitle>Create company</DialogTitle>
            <DialogDescription>
              Add a new company to manage channels, teams, flows, and campaigns.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="md:flex md:flex-wrap">
              {/* Name and Email */}
              <div className="md:w-1/2 md:pr-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company&apos;s Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormDescription>This will be your company&apos;s display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:w-1/2 md:pl-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company&apos;s Email</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter company's email" {...field} />
                      </FormControl>
                      <FormDescription>Enter the email address for your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone and Website */}
              <div className="md:w-1/2 md:pr-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter the phone number for your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:w-1/2 md:pl-2">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company&apos;s Website</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter company's website" {...field} />
                      </FormControl>
                      <FormDescription>Enter the website URL for your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Street Address */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormDescription>Enter the street address for your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City, State, and ZIP Code */}
              <div className="md:w-1/3 md:pr-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormDescription>Enter the city where your company is located.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:w-1/3 md:px-2">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormDescription>Enter the state where your company is located.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:w-1/3 md:pl-2">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter zip code" {...field} />
                      </FormControl>
                      <FormDescription>Enter the ZIP code for your company&apos;s location.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Country */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <SelectTrigger >
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryOptions.map((option) => (
                              <SelectItem key={option.label} value={option.label}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Select the country where your company is located.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button disabled={loading} type="submit">
                  {loading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}{" "}Continue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
