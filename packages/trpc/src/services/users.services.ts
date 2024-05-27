import { remember } from "@epic-web/remember";

import type { FormFieldsSignupSchema } from "@teso/validators/auth";
import { prisma } from "@teso/db";
import { HttpStatus } from "@teso/enum/http-status";
import { createError } from "@teso/error/http";
import { generateHash, generateSalt } from "@teso/shared/password";
import { generatorName } from "@teso/shared/utils";

export class UsersService {
  /**
   * @description 회원가입
   * @param {FormFieldsSignupSchema} input - 회원가입 정보
   */
  async signup(input: FormFieldsSignupSchema) {
    const user = await prisma.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (user) {
      throw createError({
        message: "이미 사용 중인 아이디입니다.",
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }

    const salt = await generateSalt();
    const hash = await generateHash(input.password, salt);

    const name = generatorName(input.username);

    return await prisma.user.create({
      data: {
        name,
        username: input.username,
        password: hash,
        salt,
        image: undefined,
        profile: {
          create: {
            bio: undefined,
            website: undefined,
          },
        },
      },
    });
  }
}

export const usersService =
  process.env.NODE_ENV === "development"
    ? new UsersService()
    : remember("usersService", () => new UsersService());
