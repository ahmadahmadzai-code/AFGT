import { z } from "zod";

export const projectSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(2).max(200),
  industry: z.string().min(1).max(80),
  year: z.coerce.number().int().min(2000).max(2100),
  summary: z.string().min(10).max(400),
  body: z.string().min(10),
  coverImage: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const serviceSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(2).max(120),
  icon: z.string().min(1).max(60),
  shortDesc: z.string().min(10).max(300),
  body: z.string().min(10),
  features: z.array(z.string()).default([]),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  quote: z.string().min(10).max(800),
  author: z.string().min(2).max(120),
  role: z.string().min(1).max(120),
  company: z.string().min(1).max(160),
  avatar: z.string().url().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const postSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(2).max(200),
  excerpt: z.string().min(10).max(400),
  body: z.string().min(10),
  coverImage: z.string().url(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const submissionUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),
  notes: z.string().max(4000).optional().nullable(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(120),
  tagline: z.string().min(1).max(240),
  email: z.string().email(),
  phone: z.string().min(3).max(40),
  address: z.string().min(1).max(240),
  socials: z.record(z.string(), z.string().url().or(z.literal(""))),
  seoImage: z.string().url().optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(160).optional(),
  budget: z.string().max(60).optional(),
  message: z.string().min(10).max(4000),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type SubmissionUpdateInput = z.infer<typeof submissionUpdateSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
