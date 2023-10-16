'use client'

import React, { useEffect, useState } from 'react'
import { initializeFaceBookSDK, startWhatsAppSignupFlow } from '@/lib/facebook'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'

export default function WhatsAppSignUpFlow() {
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
    <Button onClick={handleWhatsAppSignup} variant="outline" disabled={!sdkInitialized}>
      <Icons.facebook className="mr-2 h-4 w-4" />
      Connect to Facebook
    </Button>
  )
}
