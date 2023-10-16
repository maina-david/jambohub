import { env } from 'env.mjs'
import { fetchCompanyDetails } from '@/actions/user-actions'

export const FacebookAppId = env.NEXT_PUBLIC_FACEBOOK_APP_ID

export const ConfigurationId = env.NEXT_PUBLIC_CONFIGURATION_ID

export const initializeFaceBookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: FacebookAppId,
        xfbml: true,
        version: 'v18.0',
      })
      resolve()
    }
  })
}

export const startWhatsAppSignupFlow = () => {
  window.FB.login(function (response) {
    if (response.authResponse) {
      console.log('Auth Response: ', response.authResponse)
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
