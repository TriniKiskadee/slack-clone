import z from "zod";

export const workspaceSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be less than 50 characters"),
})

export type workspaceSchemaType = z.infer<typeof workspaceSchema>