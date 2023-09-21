import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_ID,
      clientSecret: env.TWITTER_SECRET,
      version: "2.0",
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = {
          id: 'tfhfgfasdfgfxdzsdfdf',
          email: 'test@test.com',
          name: 'Test Account'
        }

        return user
      }
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async signIn({ user }) {
      if (user && user.email) {
        // Check if the user has a subscription plan
        const dbUser = await db.user.findFirst({
          where: {
            email: user.email,
          },
          include: {
            Subscription: true, // Include the user's subscription
          },
        })

        if (!dbUser || !dbUser.Subscription) {
          // If the user doesn't have a subscription, create a free plan for them
          // Calculate the current date and time
          const currentDate = new Date()

          // Calculate the date 2 weeks from now
          const twoWeeksLater = new Date(currentDate)
          twoWeeksLater.setDate(currentDate.getDate() + 14) // Adding 14 days

          // Format it as an ISO string
          const currentPeriodEnd = twoWeeksLater.toISOString()

          await db.subscription.create({
            data: {
              userId: user.id,
              plan: "FREE",
              maxCompanies: 1,
              maxUsers: 1,
              currentPeriodEnd: currentPeriodEnd
            },
          })
        }
      }
      return true
    },
  },
}
