import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { teamPatchSchema } from "@/lib/validations/team"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    teamId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this team.
    if (!(await verifyCurrentUserHasAccessToteam(params.teamId))) {
      return new Response(null, { status: 403 })
    }

    if (!(await verifyTeamBelongsToCompany(params.companyId, params.teamId))) {
      return new Response(null, { status: 422 })
    }

    // Delete the team.
    await db.team.delete({
      where: {
        id: params.teamId as string,
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

    // Check if the user has access to this team.
    if (!(await verifyCurrentUserHasAccessToteam(params.teamId))) {
      return new Response(null, { status: 403 })
    }

    if (!(await verifyTeamBelongsToCompany(params.companyId, params.teamId))) {
      return new Response(null, { status: 422 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = teamPatchSchema.parse(json)

    // Update the team.
    await db.team.update({
      where: {
        id: params.teamId,
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

async function verifyCurrentUserHasAccessToteam(teamId: string) {
  const session = await getServerSession(authOptions)
  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
    include: { company: true }
  })

  if (!team || team.company.ownerId !== session?.user.id) {
    return false
  }

  return true

}

async function verifyTeamBelongsToCompany(companyId: string, teamId: string) {
  const team = await db.team.findUnique({
    where: {
      id: teamId,
      companyId: companyId
    }
  })

  if (!team) {
    return false
  }

  return true

}
