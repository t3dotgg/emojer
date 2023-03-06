import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUser = (user: ClerkUser) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const profileRouter = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPromise = clerkClient.users.getUser(input.id).then(filterUser);

      const postsPromise = ctx.prisma.post.findMany({
        where: { authorId: input.id },
      });

      const user = await userPromise;
      const posts = await postsPromise;

      if (!user) throw new Error("User not found");

      return { user, posts };
    }),

  getProfileByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPromise = clerkClient.users
        .getUserList({ username: [input.username] })
        .then((m) => m.map(filterUser));
      const [user] = await userPromise;

      if (!user) throw new Error("User not found");

      return user;
    }),
});
