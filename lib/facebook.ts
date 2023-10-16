import { env } from 'env.mjs'
import { fetchCompanyDetails } from '@/actions/user-actions'

export const FacebookAppId = env.NEXT_PUBLIC_FACEBOOK_APP_ID

export const ConfigurationId = env.NEXT_PUBLIC_CONFIGURATION_ID

export const initializeFaceBookSDK = () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: FacebookAppId,
      xfbml: true,
      version: 'v18.0'
    })
  };
  (function (d: Document, s: string, id: string) {
    var js: HTMLScriptElement
    var fjs: HTMLScriptElement | null = d.getElementsByTagName(s)[0] as HTMLScriptElement | null
    if (d.getElementById(id)) { return }
    js = d.createElement(s) as HTMLScriptElement
    js.id = id
    js.src = `https://connect.facebook.net/en_US/sdk.js`
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs)
    }
  }(document, 'script', 'facebook-jssdk'))
}

export const startWhatsAppSignupFlow = () => {
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
