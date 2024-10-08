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
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  name: z.string().min(1)
})

export const FlowCreateDialog = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post(`/api/companies/${params?.companyId}/flows`, {
        ...values,
      })
      queryClient.invalidateQueries({ queryKey: ['companyFlows'] })
      setOpen(false)
      toast({
        title: "Success",
        description: "Flow created successfully",
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
    <Dialog open={open} onOpenChange={setOpen}>
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
            <div className="grid gap-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={loading} placeholder="Enter flow name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
