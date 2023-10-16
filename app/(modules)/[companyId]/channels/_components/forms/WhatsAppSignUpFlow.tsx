'use client'

import React, { useEffect } from 'react'
import { initializeFaceBookSDK, startWhatsAppSignupFlow } from '@/lib/facebook'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'

export default function WhatsAppSignUpFlow() {
  const params = useParams()

  useEffect(() => {
    initializeFaceBookSDK()
  }, [])

  const handleWhatsAppSignup = () => {
    startWhatsAppSignupFlow()
  }

  return (
    <div>
      <Button onClick={handleWhatsAppSignup} variant={'outline'}>
        <Icons.facebook className='mr-2 h-4 w-4' />
        Connect to Facebook
      </Button>
    </div>
  )
}
