'use client'

import React, { useEffect } from 'react'
import { ConfigurationId, FacebookAppId } from '@/lib/facebook'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useParams } from 'next/navigation'

export default function WhatsAppSignUpFlow() {
  const params = useParams()

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FacebookAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v18.0'
      })
    }
  }, [])

  const handleWhatsAppSignup = () => {
    window.FB.login(function (response) {
      if (response.authResponse) {
        const code = response.authResponse.code
        console.log('returned code: ', code)
      } else {
        console.log('User cancelled login or did not fully authorize.')
      }
    }, {
      config_id: ConfigurationId,
      response_type: 'code',
      override_default_response_type: true,
      // extras: {
      //   setup: {
      //     business: {
      //       name: 'Acme Inc.',
      //       email: 'johndoe@acme.com',
      //       phone: {
      //         code: 1,
      //         number: '6505551234',
      //       },
      //       website: 'https://www.acme.com',
      //       address: {
      //         streetAddress1: '1 Acme Way',
      //         city: 'Acme Town',
      //         state: 'CA',
      //         zipPostal: '94000',
      //         country: 'US',
      //       },
      //       timezone: 'UTC-08:00',
      //     },
      //     phone: {
      //       displayName: 'Acme Inc',
      //       category: 'ENTERTAIN',
      //       description: 'Acme Inc. is a leading entertainment company.',
      //     },
      //   },
      // },
    })
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
