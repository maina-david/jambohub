'use client'

import React from 'react'
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { useRouter } from 'next/navigation'

interface UserRegistrationFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const userRegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type FormData = z.infer<typeof userRegisterSchema>

export default function UserRegistrationForm({ className, ...props }: UserRegistrationFormProps) {
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true)

      const response = await axios.post('/api/auth/register', {
        ...values,
      })

      if (response.status === 201) {
        toast({
          title: "Check your email",
          description: "We sent you an activation email. Be sure to check your spam too.",
        })

        router.push('/login')
      } else {
        toast({
          title: "Something went wrong.",
          description: "Your sign up request failed. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          if (validationErrors.error.email) {
            // Set an error message for the email field
            form.setError('email', {
              type: 'manual',
              message: 'Email already taken',
            })
          }
        } else {
          return toast({
            title: "Something went wrong.",
            description: "Your sign up request failed. Please try again.",
            variant: "destructive",
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Names</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter your full names"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your full names as it appears on your identification document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isLoading}
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a valid email address. It will be used for verification.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        placeholder="***********"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Create a password with a mix of letters, numbers, and symbols.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Confirmation</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        placeholder="***********"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Re-enter your password to confirm.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
