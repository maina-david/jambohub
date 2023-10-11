"use client"

import React from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
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

export default function WhatsAppForm(form) {
  return (
    <>
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
    </>
  )
}
