'use client'

import React, { useEffect, useState } from 'react'
import { ConfigurationId, initializeFaceBookSDK } from '@/lib/facebook'
import { FaWhatsapp, FaXTwitter, FaFacebookF, FaCommentSms } from "react-icons/fa6"
import { useParams } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

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
          fetch(`/api/companies/${companyId}/channels/verify-business-code?code=${code}`)
            .then(async (response) => {
              if (response.ok) {
                const data = await response.json()
                console.log('Successful Response:', data)
              } else {
                const errorData = await response.json()
                console.error('Error Response:', errorData)
                toast({
                  title: 'Error',
                  description: 'An error occurred while verifying the code',
                  variant: 'destructive',
                })
              }
            })
            .catch((error) => {
              console.error('Fetch Error:', error)
              toast({
                title: 'Error',
                description: 'An error occurred during the fetch request',
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
          className='cursor-pointer'
        >
          <FaWhatsapp className='mr-2 h-4 w-4' />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaFacebookF className='mr-2 h-4 w-4' />
          FaceBook
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className='cursor-not-allowed'
        >
          <FaCommentSms className='mr-2 h-4 w-4' />
          SMS
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
