import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { Id } from './_generated/dataModel';

// Define types for better type safety
interface Note {
    _id: Id<'notes'>;
    title: string;
    slug: string;
    content: string;
    authorId: Id<'users'>;
    likes: number;
    createdAt?: number; // Added timestamp
}

interface User {
    _id: Id<'users'>;
    // Add other user fields as needed
}

// Generate upload URL for files
export const generateUploadUrl = mutation(async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
});

// Get all notes with authors
export const getNotes = query({
    args: {},
    handler: async (ctx) => {
        const notes = await ctx.db
            .query('notes')
            .order('desc')
            .collect();

        return Promise.all(
            notes.map(async (note) => {
                const author = await ctx.db.get(note.authorId);
                return {
                    ...note,
                    author,
                };
            })
        );
    },
});

// Get recent notes with authors
export const getRecentNotes = query({
    args: {},
    handler: async (ctx) => {
        const notes = await ctx.db
            .query('notes')
            .order('desc')
            .take(4);

        return Promise.all(
            notes.map(async (note) => {
                const author = await ctx.db.get(note.authorId);
                return {
                    ...note,
                    author,
                };
            })
        );
    },
});

// Get note by slug with author
export const getNotesBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const note = await ctx.db
            .query('notes')
            .withIndex('bySlug', (q) => q.eq('slug', slug))
            .unique();

        if (!note) {
            return null;
        }

        const author = await ctx.db.get(note.authorId);
        return {
            ...note,
            author,
        };
    },
});

// create notes
export const createNote = mutation({
    args: {
      title: v.string(),
      slug: v.string(),
      content: v.string(),
    },
    handler: async (ctx, args) => {
      const user = await getCurrentUserOrThrow(ctx);
  
      // Validate slug uniqueness
      const existingNote = await ctx.db
        .query('notes')
        .withIndex('bySlug', (q) => q.eq('slug', args.slug))
        .unique();
  
      if (existingNote) {
        throw new Error('A note with this slug already exists');
      }
  
      // Create note data with explicit type
      const noteData: {
        title: string;
        slug: string;
        content: string;
        authorId: typeof user._id;
        likes: number;
        createdAt: number;
      } = {
        ...args,
        authorId: user._id,
        likes: 0,
        createdAt: Date.now(),
      };
  
      return await ctx.db.insert('notes', noteData); // Save the note
    },
  });
  

// Add a new mutation to update note
export const updateNote = mutation({
    args: {
        noteId: v.id('notes'),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const note = await ctx.db.get(args.noteId);

        if (!note) {
            throw new Error('Note not found');
        }

        if (note.authorId !== user._id) {
            throw new Error('Unauthorized to update this note');
        }

        const updates: Partial<Note> = {};
        if (args.title) updates.title = args.title;
        if (args.content) updates.content = args.content;

        await ctx.db.patch(args.noteId, updates);
        return args.noteId;
    },
});