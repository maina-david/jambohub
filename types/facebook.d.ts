// global.d.ts
// This is a global declaration file for extending the `LoginOptions` interface.

declare module '@types/facebook-js-sdk' {
  interface SetupExtras {
    setup: {
      business: {
        name: string
        email: string
        phone: {
          code: number
          number: string
        }
        website: string
        address: {
          streetAddress1: string
          city: string
          state: string
          zipPostal: string
          country: string
        }
        timezone: string
      }
      phone: {
        displayName: string
        category: string
        description: string
      }
    }
  }

  interface LoginOptions extends SetupExtras {
    // Extend the LoginOptions interface with SetupExtras.
  }
}
