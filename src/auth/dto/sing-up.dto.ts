import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @IsNotEmpty()
  declare password: string;

  @IsString()
  @IsNotEmpty()
  declare repeatPassword: string;
}
