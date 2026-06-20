import { z } from "zod";

export const RoleCreateSchema = z.object({
    name: z.string().max(255),
    tags: z.array(z.string()).min(1),
});

export const RoleUpdateSchema = z
    .object({
        name: z.string().max(255).optional(),
        tags: z.array(z.string().min(1)).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided.",
    });

export type RoleCreateOutput = z.output<typeof RoleCreateSchema>;
export type RoleUpdateOutput = z.output<typeof RoleUpdateSchema>;
