import { env } from 'env.mjs'

export const FacebookAppId = env.NEXT_PUBLIC_FACEBOOK_APP_ID
export const ConfigurationId = env.NEXT_PUBLIC_CONFIGURATION_ID

export const initializeFaceBookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      try {
        FB.init({
          appId: FacebookAppId,
          xfbml: true,
          version: 'v18.0',
        })
        resolve()
        // Dispatch a custom event to signal that the SDK is fully initialized
        const sdkReadyEvent = new Event('facebookSdkReady')
        window.dispatchEvent(sdkReadyEvent)
      } catch (error) {
        reject(error)
      }
    }
  })
}

