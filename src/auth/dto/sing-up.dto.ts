import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  declare email: string;

  @IsString()
  declare password: string;

  @IsString()
  declare repeatPassword: string;
}
