import z from "zod";

export function transformChannelName(name: string) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, "") //Remove special characters (keep letters, numbers and dashes
        .replace(/-+/g, "-") // Remove  multiple consecutive dashes with single dash
        .replace(/^-|-$/g, "") // Replace leading/trailing dashes
}

export const channelSchema = z.object({
    name: z
        .string()
        .min(3, "Channel name must be at least 3 characters long")
        .max(50, "Channel name must be less than 50 characters")
        .transform((name, ctx) => {
            const transformed = transformChannelName(name)
            if (transformed.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    message: "Channel name must be at least 3 characters long"
                })

                return z.NEVER
            }

            return transformed
        })
})

export type channelSchemaType = z.infer<typeof channelSchema>