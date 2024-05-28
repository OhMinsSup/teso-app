import type {
  DefaultSession,
  NextAuthConfig,
  User as NextAuthUser,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import pick from "lodash-es/pick";
import Credentials from "next-auth/providers/credentials";

import { eq } from "@teso/db";
import { db } from "@teso/db/client";
import { Account, Password, Session, User } from "@teso/db/schema";
import { HttpStatus } from "@teso/enum/http-status";
import { createError } from "@teso/error/http";
import { secureCompare } from "@teso/shared/password";
import { schema } from "@teso/validators/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: User,
    accountsTable: Account,
    sessionsTable: Session,
  }),
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

        const { name, password } = input.data;

        const _users = await db
          .select()
          .from(User)
          .leftJoin(Password, eq(User.id, Password.userId))
          .where(eq(User.name, name))
          .limit(1);

        const _target = _users.at(0);

        if (!_target) {
          throw createError({
            message: "유저를 찾을 수 없습니다",
            status: HttpStatus.NOT_FOUND,
            data: {
              username: "유저명이 존재하지 않습니다",
            },
          });
        }

        if (_target.password?.hash) {
          const isMatch = await secureCompare(password, _target.password.hash);

          if (!isMatch) {
            throw createError({
              message: "비밀번호가 일치하지 않습니다",
              status: HttpStatus.UNAUTHORIZED,
            });
          }
        }

        return pick(_target, "user") as unknown as NextAuthUser;
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
