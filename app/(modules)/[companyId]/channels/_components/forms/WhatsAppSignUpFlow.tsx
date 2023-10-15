'use client'

import React from 'react'
import { launchWhatsAppSignup } from '@/lib/facebook'
import { Button } from '@/components/ui/button'

export default function WhatsAppSignUpFlow() {

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
