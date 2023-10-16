import { env } from 'env.mjs'
import axios from 'axios'
import { Company } from '@prisma/client'
import { fetchCompanyDetails } from '@/actions/user-actions'

export const FacebookAppId = env.NEXT_PUBLIC_FACEBOOK_APP_ID

export const ConfigurationId = env.NEXT_PUBLIC_CONFIGURATION_ID

export const initializeFacebookSDK = () => {
  return new Promise<void>(resolve => {
    if (typeof FB !== 'undefined') {
      resolve()
    } else {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: FacebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
        resolve()
      };

      // load facebook sdk script
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]

        if (d.getElementById(id)) {
          return
        }

        js = d.createElement(s)
        js.id = id
        js.src = "https://connect.facebook.net/en_US/sdk.js"

        if (fjs && fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs)
        }

      }(document, 'script', 'facebook-jssdk'))
    }
  })
}

export async function launchWhatsAppSignup(companyId: string) {
  // Conversion tracking code
  // fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {
  //   appId: FacebookAppId,
  //   feature: 'whatsapp_embedded_signup',
  // });

  const company = fetchCompanyDetails(companyId)
  // Launch Facebook login
  FB.login(function (response) {
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
