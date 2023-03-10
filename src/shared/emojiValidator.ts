import { z } from "zod";

export const emojiValidator = z.object({
  message: z.string().emoji("Emoji ONLY please <3"),
});
