"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { ToastAction } from "@/components/ui/toast"

const formSchema = z.object({
  name: z.string().min(1)
})

export const FlowCreateButton = () => {

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/companies', {
        ...values,
      })

    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status
        if (status === 402) {
          toast({
            title: "Requires Pro Plan",
            description: "You need a Pro Plan to create more flows.",
            variant: "destructive",
            action: <ToastAction altText="Upgrade now">Upgrade now</ToastAction>,
          })
        } else if (status === 403) {
          toast({
            title: "Exceeded Maximum Flow Limit",
            description: "You've reached the maximum flow limit for your plan.",
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
            description: "Flow was not created. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // Handle other unexpected errors
        toast({
          title: "Something went wrong.",
          description: "Flow was not created. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Create new Flow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Flow</DialogTitle>
          <DialogDescription>
            Name your flow, and start building
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Flow Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Enter flow name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
