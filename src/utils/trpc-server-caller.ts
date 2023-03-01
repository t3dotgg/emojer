import { auth } from "@clerk/nextjs/app-beta";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const createCaller = () => {
  const user = auth();
  const apiServerSide = appRouter.createCaller({ prisma, session: user });
  return apiServerSide;
};
