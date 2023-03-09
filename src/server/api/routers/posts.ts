import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { emojiValidator } from "~/shared/emojiValidator";

const filterUser = (user: ClerkUser) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    const userIds = posts.map((post) => post.authorId);

    const users = await clerkClient.users
      .getUserList({ userId: userIds, limit: 100 })
      .then((user) => user.map(filterUser));

    return posts.map((post) => ({
      ...post,
      user: users.find((user) => user.id === post.authorId)!,
    }));
  }),
  self: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  getPostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });

      if (!post) throw new Error("Post not found");

      const user = await clerkClient.users
        .getUser(post!.authorId)
        .then(filterUser);

      if (!user) throw new Error("Poster not found");

      return { ...post, user };
    }),

  getPostsByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: input.id },
        orderBy: { createdAt: "desc" },
      });

      const userIds = posts.map((post) => post.authorId);

      const users = await clerkClient.users
        .getUserList({ userId: userIds })
        .then((user) => user.map(filterUser));

      if (posts.length === 0) throw new Error("No posts from this user");

      return posts.map((post) => ({
        ...post,
        user: users.find((user) => user.id === post.authorId)!,
      }));
    }),

  createPost: protectedProcedure
    .input(emojiValidator)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          content: input.message,
          authorId: ctx.session.userId,
        },
      });

      return post;
    }),
});
