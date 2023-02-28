import { z } from "zod";

export const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;

export const emojiValidator = z.object({
  message: z
    .string()
    .refine((value) => emojiRegex.test(value) && value.length < 100, {
      message: "Must be an emoji",
    }),
});
