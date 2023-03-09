import { z } from "zod";

export const emojiValidator = z.object({
  message: z.string().emoji(),
});
