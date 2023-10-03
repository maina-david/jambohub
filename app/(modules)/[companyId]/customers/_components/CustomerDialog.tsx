'use client'

import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { CreateCustomerSchema } from '@/lib/validations/customer'

export default function CustomerDialog() {
  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      fullNames: '',
      identification: '',
      email: '',
      phone: '',
      occupation: ''
    },
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const onSubmit = async (values: z.infer<typeof CreateCustomerSchema>) => {
    try {
      setIsLoading(true)
      await axios.post(`/api/companies/${params?.companyId}/customers`, {
        ...values
      })
      queryClient.invalidateQueries({ queryKey: ['companyCustomers'] })
      toast({
        title: 'Success',
        description: 'Customer created succesfully'
      })
      setIsOpen(false)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          // Update form field errors
          form.setError('fullNames', {
            type: 'manual',
            message: validationErrors.fullName || '',
          })
          form.setError('identification', {
            type: 'manual',
            message: validationErrors.identification || '',
          })
          form.setError('email', {
            type: 'manual',
            message: validationErrors.email || '',
          })
        } else if (error.response.status === 403) {
          // Handle RequiresActivePlanError
          toast({
            title: 'Permission Denied',
            description: 'You do not have permission for this operation.',
            variant: 'destructive',
          })
        }
      } else {
        // Handle general errors
        console.error(error)
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant={'default'}
        >
          Create Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            Please provide the details to create a new customer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Names</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter full names"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The full names of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter identification"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The identification number of the customer.
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
                      disabled={isLoading}
                      placeholder="Enter email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The Email of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The phone number of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter occupation"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The occupation of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                variant={'default'}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}{' '}
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
