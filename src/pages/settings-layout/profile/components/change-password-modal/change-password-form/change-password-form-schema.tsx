import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Old password must be at least 6 characters.'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters.'),
    verifyNewPassword: z
      .string()
      .min(6, 'Verify new password must be at least 6 characters.'),
  })
  .refine((data) => data.newPassword === data.verifyNewPassword, {
    message: "Passwords don't match",
    path: ['verifyNewPassword'],
  });
