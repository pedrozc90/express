import { z } from "zod";
import { type FetchArgs } from "../types";

export const FetchArgsSchema = z.object({
    p: z.number().min(1).optional(),
    r: z.number().min(10).optional(),
    q: z.string().optional(),
}) as z.ZodType<FetchArgs>;
