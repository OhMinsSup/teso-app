import { Prisma } from "@prisma/client";

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({});
};
