'use client'

import React, { useEffect } from 'react'
import { initializeFacebookSDK, launchWhatsAppSignup } from '@/lib/facebook'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'

export default function WhatsAppSignUpFlow() {
  const params = useParams()

  useEffect(() => {
    initializeFacebookSDK()
  }, [])

  const handleWhatsAppSignup = () => {
    launchWhatsAppSignup(params?.companyId as string)
  }

  return (
    <Button onClick={handleWhatsAppSignup} variant={'outline'}>
      <Icons.facebook className='mr-2 h-4 w-4' />
      Connect to Facebook
    </Button>
  )
}
