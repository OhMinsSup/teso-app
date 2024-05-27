import { Prisma } from "@prisma/client";

export const getBaseUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
    emailVerified: true,
    image: true,
  });
};

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    Password: {
      select: {
        hash: true,
        salt: true,
      },
    },
  });
};

export const getExternalUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
  });
};
