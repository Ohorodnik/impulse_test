import z from 'zod';
import { fromZodError } from 'zod-validation-error';

const environmentVariablesSchema = z.object({
  PORT: z.coerce.number().positive(),
  PASSWORD_ENCRYPT_ITERATIONS: z.coerce.number().positive(),
  PASSWORD_KEYLEN: z.coerce.number().positive(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const parseResults = environmentVariablesSchema.safeParse(config);
  if (parseResults.success) {
    return parseResults.data;
  } else {
    throw new Error(`Invalid configuration:\n${fromZodError(parseResults.error).toString()}`);
  }
}
