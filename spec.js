import { z } from 'zod'

export function validate(collection) {
  return z.object({
    name: z.string(),
    title: z.string(),
    description: z.string().max(300),
    topics: z.array(z.string()),
    licenseTags: z.object({
      Access: z.string().optional(),
      'Access-Fee': z.string().optional(),
      License: z.string(),
      'License-Fee': z.string().optional(),
      Derivation: z.string().optional(),
      'Commercial-Use': z.string().optional(),
      'Payment-Mode': z.string().optional()
    }),
    owners: z.record(z.string(), z.number()),
    type: z.string(),
    code: z.string(),
    creator: z.string(),
    renderer: z.string().optional()
  }).parse(collection)
}