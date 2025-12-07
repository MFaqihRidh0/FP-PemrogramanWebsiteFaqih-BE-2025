// src/api/game/game-list/type-the-answer/type-the-answer.schema.ts

import { z } from 'zod';

export const typeAnswerQuestionSchema = z.object({
  order: z.number().int().nonnegative(),
  question_index: z.number().int().nonnegative(),

  // front-end bisa kirim snake_case atau camelCase
  question_text: z.string().min(1).optional(),
  correct_answer: z.string().min(1).optional(),
  questionText: z.string().min(1).optional(),
  correctAnswer: z.string().min(1).optional(),
});

export type TypeAnswerQuestionProps = z.infer<typeof typeAnswerQuestionSchema>;

export const typeAnswerGameSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  // biasanya File (multer / form-data), tapi di sini cukup any saja
  thumbnail_image: z.any(),
  background_image: z.any().optional(),

  is_published: z.boolean().default(false),

  time_limit_seconds: z.number().int().positive(),
  score_per_question: z.number().int().positive(),

  questions: z.array(typeAnswerQuestionSchema).min(1),
});

export type TypeAnswerGameProps = z.infer<typeof typeAnswerGameSchema>;

export const createTypeAnswerFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  thumbnail_image: z.any(),
  background_image: z.any().optional(),

  // biasanya datang sebagai string ("true"/"false") dari form
  is_published: z
    .union([z.string(), z.boolean()])
    .transform(value => (typeof value === 'string' ? value === 'true' : value))
    .default(false),

  time_limit_seconds: z.union([z.string(), z.number()]).transform(Number),

  score_per_question: z.union([z.string(), z.number()]).transform(Number),

  questions: z.array(typeAnswerQuestionSchema).min(1),
});

export type CreateTypeAnswerFormProps = z.infer<
  typeof createTypeAnswerFormSchema
>;
