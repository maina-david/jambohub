'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
      window.FB.login(async function (response) {
        if (response.authResponse) {
          const code = response.authResponse.code
          const res = await axios.post(`/api/companies/${companyId}/channels/verify-business-code`, {
            data: {
              code
            }
          })

          console.log(res)
          if (res.status == 200) {
            toast({
              title: 'Success',
              description: 'Code verified successfully!',
            })
          } else {
            console.log("Code verification failed: ", res.data)
            toast({
              title: 'Error',
              description: "Failed to verify user's code",
              variant: 'destructive',
            })
          }

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
