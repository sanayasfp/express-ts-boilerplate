import { z } from 'zod';
import {nameSchema} from "@/validators/slug";

export type Name = z.infer<typeof nameSchema>;
