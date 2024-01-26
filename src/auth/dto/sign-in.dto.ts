import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import z from 'zod';

export class SignInDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @IsNotEmpty()
  declare password: string;
}

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type SignInDto2 = z.infer<typeof signInSchema>;
