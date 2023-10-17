import { env } from 'env.mjs'

export const FacebookAppId = env.NEXT_PUBLIC_FACEBOOK_APP_ID
export const ConfigurationId = env.NEXT_PUBLIC_CONFIGURATION_ID

export const initializeFaceBookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      try {
        FB.init({
          appId: FacebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        
        (function (d, s: string, id: string) {
          var js, fjs = d.getElementsByTagName(s)[0]
          if (d.getElementById(id)) return
          js = d.createElement(s)
          js.id = id
          js.src = "https://connect.facebook.net/en_US/sdk.js"
          if (fjs && fjs.parentNode) fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))

        resolve()
      } catch (error) {
        reject(error)
      }
    }
  })
}

