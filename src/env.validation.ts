import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  declare PORT: number;

  @IsNumber()
  declare PASSWORD_ENCRYPT_ITERATIONS: number;

  @IsNumber()
  declare PASSWORD_KEYLEN: number;

  @IsString()
  @IsNotEmpty()
  declare JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  declare JWT_EXPIRES_IN: string;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
