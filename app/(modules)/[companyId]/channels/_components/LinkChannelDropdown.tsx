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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'
import { smsChannelSchema, ussdChannelSchema } from '@/lib/validations/channel'
import { Alert } from '@/components/ui/alert'

export default function LinkChannelDropdown() {
  const queryClient = useQueryClient()
  const params = useParams()
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState<boolean>(false)
  const [isSMSSubmitting, setIsSMSSubmitting] = useState<boolean>(false)
  const [isUSSDDialogOpen, setIsUSSDDialogOpen] = useState<boolean>(false)
  const [isUSSDLoading, setIsUSSDLoading] = useState<boolean>(false)
  const [sdkInitialized, setSdkInitialized] = useState<boolean>(false)
  const smsForm = useForm<z.infer<typeof smsChannelSchema>>({
    resolver: zodResolver(smsChannelSchema),
    defaultValues: {
      provider: 'AT',
      name: '',
      shortCode: '',
      username: '',
      apiKey: '',
      apiSecret: ''
    },
  })
  const USSDForm = useForm<z.infer<typeof ussdChannelSchema>>({
    resolver: zodResolver(ussdChannelSchema),
    defaultValues: {
      provider: 'AT',
      name: '',
      serviceCode: '',
      username: '',
      apiKey: '',
    },
  })

  const onSMSFormSubmit = async (values: z.infer<typeof smsChannelSchema>) => {
    try {
      setIsSMSSubmitting(true)
      await axios.post(`/api/companies/${params?.companyId}/channels/sms`, {
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
          smsForm.setError('provider', {
            type: 'manual',
            message: validationErrors.provider || '',
          })
          smsForm.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          smsForm.setError('shortCode', {
            type: 'manual',
            message: validationErrors.shortCode || '',
          })
          smsForm.setError('username', {
            type: 'manual',
            message: validationErrors.username || '',
          })
          smsForm.setError('apiKey', {
            type: 'manual',
            message: validationErrors.apiKey || '',
          })
          smsForm.setError('apiSecret', {
            type: 'manual',
            message: validationErrors.apiSecret || '',
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
      setIsSMSSubmitting(false)
    }
  }

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
          USSDForm.setError('provider', {
            type: 'manual',
            message: validationErrors.provider || '',
          })
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
        <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={(event) => {
                event.preventDefault()
                setIsSMSDialogOpen(true)
              }}
            >
              <FaCommentSms className='mr-2 h-4 w-4' />
              SMS
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New SMS channel</DialogTitle>
              <DialogDescription>
                Add a new sms channel for integration
              </DialogDescription>
              <Alert>For 2 way sms make sure you put url as callback</Alert>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...smsForm}>
                <form onSubmit={smsForm.handleSubmit(onSMSFormSubmit)}>
                  <FormField
                    control={smsForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSMSSubmitting}
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
                    control={smsForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isSMSSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a channel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AT">Africa&apos;s Talking</SelectItem>
                            <SelectItem value="BONGA">Bonga SMS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the sms provider you want to integrate with.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={smsForm.control}
                    name="shortCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ShortCode</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSMSSubmitting}
                            placeholder="Enter account shortcode"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the shortcode associated with this account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={smsForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSMSSubmitting}
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
                    control={smsForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSMSSubmitting}
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
                  <FormField
                    control={smsForm.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSMSSubmitting}
                            placeholder="Enter account API secret"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the API secret associated with this account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      disabled={isSMSSubmitting}
                      type='submit'
                    >
                      {isSMSSubmitting && (
                        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Continue
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isUSSDDialogOpen} onOpenChange={setIsUSSDDialogOpen}>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New USSD channel</DialogTitle>
              <DialogDescription>Add a new ussd channel for integration</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isUSSDLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a channel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AT">Africa&apos;s Talking</SelectItem>
                            <SelectItem value="BONGA">Bonga SMS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the sms provider you want to integrate with.
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
            </div>
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
