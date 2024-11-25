import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    posts: v.optional(v.array(v.id('notes')))
  }).index('byClerkUserId', ['clerkUserId']),
  notes: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.id('users'),
    likes: v.number(),
    createdAt: v.float64() // Add this field to the schema
  }).index('bySlug', ['slug'])
})
