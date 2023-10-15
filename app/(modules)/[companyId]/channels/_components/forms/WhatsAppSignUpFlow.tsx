'use client'

import React, { useEffect } from 'react'
import { initializeFacebookSDK, launchWhatsAppSignup } from '@/lib/facebook'
import { Button } from '@/components/ui/button'

export default function WhatsAppSignUpFlow() {

  useEffect(() => {
    initializeFacebookSDK()
  }, [])

  const handleWhatsAppSignup = () => {
    // Call the function to launch WhatsApp signup
    launchWhatsAppSignup()
  }

  return (
    <Button onClick={handleWhatsAppSignup}>
      Launch Facebook Login
    </Button>
  )
}
