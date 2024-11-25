import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



interface SlugifyOptions {
  /** Convert to lowercase (default: true) */
  lower?: boolean;
  /** Remove all characters that are not letters, numbers, or hyphens (default: true) */
  strict?: boolean;
}

export const slugify = (text: string, options: SlugifyOptions = {}): string => {
  const {
    lower = true,
    strict = true
  } = options;

  // Convert to lowercase if option is set
  let slug = lower ? text.toLowerCase() : text;

  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, '-');

  if (strict) {
    // Remove all characters that are not letters, numbers, or hyphens
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '');
  } else {
    // Less strict: preserve some special characters but still make it URL-safe
    slug = slug.replace(/[^a-zA-Z0-9-&]/g, '');
  }

  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}
