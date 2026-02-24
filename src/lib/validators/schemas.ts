import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.email().optional().or(z.literal("")),
  company: z.string().optional(),
  notes: z.string().optional()
});

export const projectSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().min(2),
  status: z.enum(["planned", "active", "completed", "on_hold"]).default("active"),
  budget: z.coerce.number().min(0),
  description: z.string().optional()
});

export const taskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2),
  status: z.enum(["todo", "in_progress", "done"]).default("todo")
});

export const timeEntrySchema = z
  .object({
    projectId: z.string().min(1),
    taskId: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    note: z.string().optional()
  })
  .refine((v) => v.end > v.start, { message: "End must be after start", path: ["end"] });

export const invoiceSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  dueDate: z.coerce.date(),
  tax: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.coerce.number().min(1),
      unitPrice: z.coerce.number().min(0)
    })
  )
});

export const workspaceSettingsSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers and dashes"),
  timezone: z.string().min(2).max(80),
  currency: z
    .string()
    .length(3)
    .regex(/^[A-Z]{3}$/, "Currency must be a 3-letter ISO code"),
  logoUrl: z.string().url().optional().or(z.literal(""))
});
