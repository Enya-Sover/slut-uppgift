import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const schema: z.ZodType<NewUser> = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6).max(50)
});

const userSchema: z.ZodType<User> = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.string(),
  password: z.string().min(6).max(50),
  is_admin: z.boolean(),
  created_at: z.coerce.string()
});

export const newUserValidator = zValidator("json", schema, (result, c) => {
  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }
});
export const userValidator = zValidator("json", userSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }
});



const querySchema: z.ZodType<UserListQuery> = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(10, "Limit must be at least 10")
    .max(50, "Limit cannot exceed 50")
    .default(10),
  offset: z.coerce
    .number()
    .int()
    .min(0, "Offset cannot be negative")
    .default(0),
  q: z.string().optional(),
  sort_by: z.enum(["name"]).default("name").optional()

});

export const userQueryValidator = zValidator("query", querySchema);


export const updateUserValidator = zValidator(
  "json",
  z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(6).max(50).optional(),
    is_admin: z.boolean().optional(),
  })
);