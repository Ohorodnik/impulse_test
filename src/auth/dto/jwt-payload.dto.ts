import z from 'zod';

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
});
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
