import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { companyPatchSchema } from "@/lib/validations/company"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this company.
    if (!(await verifyCurrentUserHasAccessToCompany(params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the company.
    const company = await db.company.findFirst({
      where: {
        id: params.companyId as string,
      },
    })

    return new Response(JSON.stringify(company), { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}


export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this company.
    if (!(await verifyCurrentUserHasAccessToCompany(params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the company.
    await db.company.delete({
      where: {
        id: params.companyId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this company.
    if (!(await verifyCurrentUserHasAccessToCompany(params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = companyPatchSchema.parse(json)

    // Update the company.
    await db.company.update({
      where: {
        id: params.companyId,
      },
      data: {
        name: body.name,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToCompany(companyId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.company.count({
    where: {
      id: companyId,
      ownerId: session?.user.id,
    },
  })

  return count > 0
}
