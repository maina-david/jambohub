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
import { Icons } from "../icons"

const formSchema = z.object({
  name: z.string().min(1)
})

export const CompanyModal = () => {
  const companyModal = useCompanyModal()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/companies', {
        ...values,
      });
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status;
        if (status === 402) {
          toast({
            title: "Requires Pro Plan",
            description: "You need a Pro Plan to create more companies.",
            variant: "destructive",
          });
        } else if (status === 403) {
          toast({
            title: "Exceeded Maximum Company Limit",
            description: "You've reached the maximum company limit for your plan.",
            variant: "destructive",
          });
        } else if (status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data;
          toast({
            title: "Validation Error",
            description: "Please correct the following errors: " + validationErrors.join(", "),
            variant: "destructive",
          });
        } else {
          // Handle other unexpected errors
          toast({
            title: "Something went wrong.",
            description: "Your company was not created. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Handle other unexpected errors
        toast({
          title: "Something went wrong.",
          description: "Your company was not created. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };


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
            Add a new company to manage channels, teams and chatflows.
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
            <DialogFooter>
              <Button
                disabled={loading}
                type="submit">
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}
