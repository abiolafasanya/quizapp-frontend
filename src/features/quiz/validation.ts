import { z } from "zod";
export const questionSchema = z.object({
  text: z.string().min(10, "Question is too short"),
  options: z
    .array(z.object({ id: z.string().optional(), text: z.string().min(1) }))
    .length(4),
  correctOptionId: z.string(),
});
export type QuestionInput = z.infer<typeof questionSchema>;
