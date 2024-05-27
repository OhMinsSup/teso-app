import type { TRPCRouterRecord } from "@trpc/server";

import { schema } from "@veloss/validators/auth";

import { usersService } from "../services/users.services";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getRequireSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  signup: publicProcedure
    .input(schema.signup)
    .mutation(async ({ input }) => await usersService.signup(input)),
} satisfies TRPCRouterRecord;
