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
import { useParams } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import axios from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import SmsChannelLinkDialog from './dialogs/sms-dialog'
import USSDChannelLinkDialog from './dialogs/ussd-dialog'

export default function LinkChannelDropdown() {
  const params = useParams()
  const [sdkInitialized, setSdkInitialized] = useState<boolean>(false)

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
    <DropdownMenu modal={false}>
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
        <DropdownMenuItem
          className='cursor-pointer'
        >
          <SmsChannelLinkDialog />
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer'
        >
          <USSDChannelLinkDialog />
        </DropdownMenuItem>
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
    </DropdownMenu>
  )
}
