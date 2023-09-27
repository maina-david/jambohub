import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    teamId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);
    const { companyId, teamId } = params;

    // Use Prisma to query the team members.
    const teamMembers = await db.user.findMany({
      where: {
        teams: {
          some: {
            teamId, 
          },
        },
      },
    });

    // Return the team members as JSON response.
    return new Response(JSON.stringify(teamMembers));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

