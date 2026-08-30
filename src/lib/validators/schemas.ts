import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier");

const optionalObjectIdSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  objectIdSchema.optional()
);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128)
});

export const workspaceCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain lowercase letters, numbers and dashes"
    ),
  plan: z.enum(["free", "pro"])
});

export const inviteMemberSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  role: z.enum(["admin", "member", "viewer"])
});

export const clientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(5_000).optional()
});

export const projectSchema = z.object({
  clientId: objectIdSchema,
  name: z.string().trim().min(2).max(160),
  status: z
    .enum(["planned", "active", "completed", "on_hold"])
    .default("active"),
  budget: z.coerce.number().min(0).max(1_000_000_000),
  description: z.string().trim().max(10_000).optional()
});

export const taskSchema = z.object({
  projectId: objectIdSchema,
  title: z.string().trim().min(2).max(240),
  status: z.enum(["todo", "in_progress", "done"]).default("todo")
});

export const timeEntrySchema = z
  .object({
    projectId: objectIdSchema,
    taskId: optionalObjectIdSchema,
    start: z.coerce.date(),
    end: z.coerce.date(),
    note: z.string().trim().max(2_000).optional()
  })
  .refine((v) => v.end > v.start, {
    message: "End must be after start",
    path: ["end"]
  });

export const invoiceSchema = z
  .object({
    clientId: objectIdSchema,
    projectId: optionalObjectIdSchema,
    dueDate: z.coerce.date(),
    tax: z.coerce.number().min(0).max(1_000_000_000).default(0),
    discount: z.coerce.number().min(0).max(1_000_000_000).default(0),
    items: z
      .array(
        z.object({
          description: z.string().trim().min(1).max(500),
          quantity: z.coerce.number().min(0.01).max(1_000_000),
          unitPrice: z.coerce.number().min(0).max(1_000_000_000)
        })
      )
      .min(1)
      .max(100)
  })
  .refine(
    (invoice) => {
      const subtotal = invoice.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      return invoice.discount <= subtotal + invoice.tax;
    },
    { message: "Discount cannot exceed the invoice amount", path: ["discount"] }
  );

export const invoiceFromTimeEntriesSchema = z.object({
  clientId: objectIdSchema,
  projectId: objectIdSchema,
  entryIds: z.array(objectIdSchema).min(1).max(500),
  hourlyRate: z.coerce.number().positive().max(1_000_000),
  dueDate: z.coerce.date()
});

export const workspaceSettingsSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain lowercase letters, numbers and dashes"
    ),
  timezone: z.string().min(2).max(80),
  currency: z
    .string()
    .length(3)
    .regex(/^[A-Z]{3}$/, "Currency must be a 3-letter ISO code"),
  logoUrl: z.string().url().optional().or(z.literal(""))
});
