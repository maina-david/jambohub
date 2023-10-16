'use client'

import React, { useEffect, useState } from 'react'
import { initializeFaceBookSDK, startWhatsAppSignupFlow } from '@/lib/facebook'
import { FaWhatsapp, FaXTwitter, FaFacebookF, FaCommentSms } from "react-icons/fa6"
import { useParams } from 'next/navigation'
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

  const handleWhatsAppSignup = () => {
    if (sdkInitialized) {
      startWhatsAppSignupFlow()
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
