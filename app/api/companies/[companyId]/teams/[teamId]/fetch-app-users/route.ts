import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
    teamId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);
    const { companyId, teamId } = params;

    // Get the query parameter from the request URL.
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    const query = queryParams.get('query');

    if (!query) {
      return new Response("Query parameter 'query' is missing.", { status: 400 });
    }

    let searchField;
    if (query.includes('@')) {
      // If the query contains '@', treat it as an email search.
      searchField = 'email';
    } else {
      // Otherwise, search by name.
      searchField = 'name';
    }

    // Search for users based on the query and search field.
    const users = await db.user.findMany({
      where: {
        [searchField]: {
          contains: query,
        },
      },
    });

    return new Response(JSON.stringify(users));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}
