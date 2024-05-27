import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import type { User } from "@teso/db";
import { prisma } from "@teso/db";
import { getExternalUserSelector, getUserSelector } from "@teso/db/selectors";
import { HttpStatus } from "@teso/enum/http-status";
import { createError } from "@teso/error/http";
import { secureCompare } from "@teso/shared/password";
import { schema } from "@teso/validators/auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const input = await schema.signin.safeParseAsync(credentials);
        if (!input.success) {
          throw createError({
            message: "잘못된 입력값",
            status: HttpStatus.BAD_REQUEST,
            data: {
              key: input.error.name,
              message: input.error.message,
            },
          });
        }

        const { username, password } = input.data;

        const user = await prisma.user.findFirst({
          where: {
            name: username,
          },
          select: getUserSelector(),
        });

        if (!user) {
          throw createError({
            message: "유저를 찾을 수 없습니다",
            status: HttpStatus.NOT_FOUND,
            data: {
              username: "유저명이 존재하지 않습니다",
            },
          });
        }

        if (user.Password?.hash) {
          const isMatch = await secureCompare(password, user.Password.hash);

          if (!isMatch) {
            throw createError({
              message: "비밀번호가 일치하지 않습니다",
              status: HttpStatus.UNAUTHORIZED,
            });
          }
        }

        return await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          select: getExternalUserSelector(),
        });
      },
      credentials: {
        username: {},
        password: {},
      },
    }),
  ],
  callbacks: {
    session: (opts) => {
      if (!("user" in opts)) throw "unreachable with session strategy";

      console.log("opts ==>", opts);

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
