import { z } from 'zod';
export const verdictSchema=z.object({suspectId:z.string().min(1).max(80),explanation:z.string().max(1000).optional().default('')}).strict();
