'use client'

import React, { useEffect, useState } from 'react'
import { ConfigurationId, initializeFaceBookSDK } from '@/lib/facebook'
import { FaWhatsapp, FaXTwitter, FaFacebookF, FaCommentSms } from "react-icons/fa6"
import { useParams, usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const [sdkInitialized, setSdkInitialized] = useState<boolean>(false)

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await initializeFaceBookSDK()
        window.addEventListener('facebookSdkReady', () => {
          setSdkInitialized(true)
        })
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
          console.log("Returned code: ", code)
          fetch(`/api/companies/${companyId}/channels/verify-business-code?code=${code}`)
            .then(async (response) => {
              if (response.ok) {
                try {
                  const data = await response.json()
                  console.log('Successful Response:', data)
                } catch (jsonError) {
                  console.error('JSON Parsing Error:', jsonError)
                  toast({
                    title: 'Error',
                    description: 'Error parsing the response',
                    variant: 'destructive',
                  })
                }
              } else {
                // Handle non-JSON responses here
                const textData = await response.text()
                console.error('Error Response:', textData)
                toast({
                  title: 'Error',
                  description: 'An error occurred while verifying the code',
                  variant: 'destructive',
                })
              }
            })
            .catch((fetchError) => {
              console.error('Fetch Error:', fetchError)
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
          Facebook
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
