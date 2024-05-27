import * as z from "zod";

export const schema = {
  signup: z
    .object({
      confirmPassword: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
      username: z.string().min(1, "유저명은 1글자 이상이어야 합니다."),
      password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["confirmPassword"],
    }),
  signin: z.object({
    username: z.string().min(1, "유저명은 1글자 이상이어야 합니다."),
    password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
  }),
};

export type FormFieldsSignupSchema = z.infer<typeof schema.signup>;

export type FormFieldsSigninSchema = z.infer<typeof schema.signin>;
