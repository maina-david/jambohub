import Link from "next/link"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/shadcn/taxonomy",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    )

    if (!response?.ok) {
      return null
    }

    const json = await response.json()

    return parseInt(json["stargazers_count"]).toLocaleString()
  } catch (error) {
    return null
  }
}

export default async function IndexPage() {
  const stars = await getGitHubStars()

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to JamboHub!
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A versatile communication and campaign management platform, designed to connect users across multiple channels, including WhatsApp, Twitter, and more.
          </p>
          <div className="space-x-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            It offers powerful features for running campaigns, building automated responses, and facilitating seamless conversations.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {/* Feature 1: Multi-Channel Integration */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">

              <div className="space-y-2">
                <h3 className="font-bold">Multi-Channel Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Integration with WhatsApp, Twitter, and more for seamless communication.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Campaign Management */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Campaign Management</h3>
                <p className="text-sm text-muted-foreground">
                  Create, schedule, and manage marketing campaigns with audience segmentation.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Automated Responses */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Automated Responses</h3>
                <p className="text-sm text-muted-foreground">
                  Build automated response workflows with conditional logic and triggers.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4: Message Routing */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Message Routing</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent routing of incoming messages to relevant workflows or human agents for efficient handling.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 5: User Management */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  User authentication, role-based access control, and customizable user profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 6: Analytics and Reporting */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Analytics and Reporting</h3>
                <p className="text-sm text-muted-foreground">
                  Track campaign performance, conversation analytics, and user engagement.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
