import { z } from 'zod';

export const nameSchema = z.object({
    name: z.string().default('world'),
});
