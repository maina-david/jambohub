'use client'

import React, { useEffect, useState } from 'react'
import { ConfigurationId, initializeFaceBookSDK } from '@/lib/facebook'
import {
  FaWhatsapp,
  FaXTwitter,
  FaFacebookMessenger,
  FaCommentSms
} from "react-icons/fa6"
import { BiDialpad } from "react-icons/bi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button'
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
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { smsChannelSchema, ussdChannelSchema } from '@/lib/validations/channel'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Link1Icon } from '@radix-ui/react-icons'

export default function LinkChannelDropdown() {
  const queryClient = useQueryClient()
  const params = useParams()
  const [isUSSDDialogOpen, setIsUSSDDialogOpen] = useState<boolean>(false)
  const [isUSSDLoading, setIsUSSDLoading] = useState<boolean>(false)
  const [sdkInitialized, setSdkInitialized] = useState<boolean>(false)
  const smsForm = useForm<z.infer<typeof smsChannelSchema>>({
    resolver: zodResolver(smsChannelSchema),
    defaultValues: {
      name: '',
      shortCode: '',
      username: '',
      apiKey: '',
    },
  })
  const USSDForm = useForm<z.infer<typeof ussdChannelSchema>>({
    resolver: zodResolver(ussdChannelSchema),
    defaultValues: {
      name: '',
      serviceCode: '',
      username: '',
      apiKey: '',
    },
  })

  const onUSSDFormSubmit = async (values: z.infer<typeof ussdChannelSchema>) => {
    try {
      setIsUSSDLoading(true)
      await axios.post(`/api/companies/${params?.companyId}/channels/ussd`, {
        ...values
      })
      queryClient.invalidateQueries(['companyChannels'])
      toast({
        title: 'Success',
        description: 'Channel created successfully!',
      })
    } catch (error) {
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          // Update form field errors
          USSDForm.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          USSDForm.setError('serviceCode', {
            type: 'manual',
            message: validationErrors.serviceCode || '',
          })
          USSDForm.setError('username', {
            type: 'manual',
            message: validationErrors.username || '',
          })
          USSDForm.setError('apiKey', {
            type: 'manual',
            message: validationErrors.apiKey || '',
          })
        } else if (error.response.status === 402) {
          // Handle RequiresProPlanError
          toast({
            title: 'Requires Pro Plan',
            description: 'You need a pro plan for this operation.',
            variant: 'destructive',
          })
        } else if (error.response.status === 403) {
          // Handle RequiresActivePlanError or MaximumPlanResourcesError
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
      setIsUSSDLoading(false)
    }
  }

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await initializeFaceBookSDK()
        setSdkInitialized(true)
      } catch (error) {
        console.error('Failed to initialize Facebook SDK', error)
        setSdkInitialized(false)
      }
    }
    initializeSDK()
  }, [])

  const handleWhatsAppSignup = async () => {
    if (sdkInitialized) {
      const companyId = params?.companyId

      window.FB.login(function (response) {
        if (response.authResponse) {
          const code = response.authResponse.code

          axios
            .get(`/api/companies/${companyId}/channels/verify-business-code?code=${code}`)
            .then((response) => {
              if (response.status === 200) {
                console.log('Successful Response:', response.data)
              } else {
                console.error('Error Response:', response.data)
                toast({
                  title: 'Error',
                  description: 'An error occurred while verifying your account',
                  variant: 'destructive',
                })
              }
            })
            .catch((error) => {
              console.log("Axios error: ", error)
              toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
              })
            })
        } else {
          toast({
            title: 'Error',
            description: 'User cancelled login or did not fully authorize',
            variant: 'destructive',
          })
        }
      }, {
        config_id: ConfigurationId,
        response_type: 'code',
        override_default_response_type: true,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={'outline'}>
          Connect Channel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Supported Channels</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!sdkInitialized}
          onSelect={handleWhatsAppSignup}
          className="cursor-pointer"
        >
          <FaWhatsapp className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <Dialog open={isUSSDDialogOpen} onOpenChange={setIsUSSDDialogOpen} modal>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={(event) => {
                event.preventDefault()
                setIsUSSDDialogOpen(true)
              }}
            >
              <BiDialpad className='mr-2 h-4 w-4' />
              USSD
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New USSD channel</DialogTitle>
              <DialogDescription>
                <Alert>
                  <Link1Icon className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    Only Africa&apos;s Talking integration is supported.
                    Make sure you specify callback and events urls as
                    <code
                    className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      https://jambohub.vercel.app/api/webhooks/ussd
                    </code>
                  </AlertDescription>
                </Alert>
              </DialogDescription>
            </DialogHeader>
            <Form {...USSDForm}>
              <form onSubmit={USSDForm.handleSubmit(onUSSDFormSubmit)}>
                <FormField
                  control={USSDForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
                          placeholder="Enter account name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a display name to associate with this account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={USSDForm.control}
                  name="serviceCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
                          placeholder="Enter account service code"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the service code associated with this account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={USSDForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
                          placeholder="Enter account username"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the username associated with this account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={USSDForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUSSDLoading}
                          placeholder="Enter API Key"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the API Key associated with this account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={isUSSDLoading}
                    type='submit'
                  >
                    {isUSSDLoading && (
                      <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Continue
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaFacebookMessenger className='mr-2 h-4 w-4' />
          Messenger
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaXTwitter className='mr-2 h-4 w-4' />
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
