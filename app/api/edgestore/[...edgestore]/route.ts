import { initEdgeStore } from '@edgestore/server'
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app'
import { z } from 'zod'

const es = initEdgeStore.create()

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  companyFiles: es.fileBucket({
    maxSize: 1024 * 1024 * 10, // 10MB
  })
    .input(
      z.object({
        companyId: z.string()
      })
    )
    .path(({ input }) => [{ companyId: input.companyId }]),
  profilePictures: es.imageBucket({
    maxSize: 1024 * 1024 * 1, //1MB
  })
    .input(
      z.object({
        userId: z.string()
      })
    )
    .path(({ input }) => [{ userId: input.userId }]),
})

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
})

export { handler as GET, handler as POST }

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter
