// @ts-nocheck
import { UserSubscriptionPlan } from "types"
import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { Subscription: true }
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.Subscription) {
      throw new Error("User has no subscription plan")
    }
    const subscriptionPlan = user.Subscription

    return subscriptionPlan

  } catch (error) {
    console.error("Error fetching user subscription plan:", error)
    throw error
  }
}
