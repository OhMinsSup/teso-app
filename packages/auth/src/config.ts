import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import type { User, UserProfile } from "@veloss/db";
import { prisma } from "@veloss/db";
import { getUserSelector } from "@veloss/db/selectors";
import { HttpStatus } from "@veloss/enum/http-status";
import { createError } from "@veloss/error/http";
import { secureCompare } from "@veloss/shared/password";
import { schema } from "@veloss/validators/auth";

declare module "next-auth" {
  interface Session {
    user: {
      profile: Pick<UserProfile, "bio" | "website"> | null;
    } & Pick<
      User,
      "id" | "name" | "username" | "email" | "emailVerified" | "image"
    >;
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

        const user1 = await prisma.user.findUnique({
          where: {
            username: input.data.username,
          },
          select: getUserSelector(),
        });

        if (!user1) {
          throw createError({
            message: "유저를 찾을 수 없습니다",
            status: HttpStatus.NOT_FOUND,
            data: {
              username: "User not found",
            },
          });
        }

        if (user1.Password.hash) {
          const isMatch = await secureCompare(
            input.data.password,
            user1.Password.hash,
          );

          if (!isMatch) {
            throw createError({
              message: "비밀번호가 일치하지 않습니다",
              status: HttpStatus.UNAUTHORIZED,
            });
          }
        }

        const user2 = await prisma.user.findUnique({
          where: {
            id: user1.id,
          },
          select: getUserSelector(),
        });

        return user2;
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
