"use client"

import * as z from "zod"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const formSchema = z.object({
  accessToken: z.string().min(1),
  phoneNumberId: z.number(),
})

export default function WhatsAppForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: "",
      phoneNumberId: undefined,
    },
  })

  const onSubmit = (data) => {
    // Handle form submission, e.g., send data to the server
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="accessToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Token</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Enter your permanent access token.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number ID</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Enter your numeric phone number ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
