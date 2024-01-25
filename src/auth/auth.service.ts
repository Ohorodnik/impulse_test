import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pbkdf2, randomBytes } from 'node:crypto';
import { EnvironmentVariables } from 'src/env.validation';
import { promisify } from 'util';
const pbkdf2Promisified = promisify(pbkdf2);

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService<EnvironmentVariables, true>) {}

  public async encryptPassword(pwd: string): Promise<{ password: Buffer; salt: Buffer }> {
    const pwdKeylen = this.configService.get('PASSWORD_KEYLEN');
    const salt = randomBytes(pwdKeylen);
    const encryptedPwd = await pbkdf2Promisified(
      pwd,
      salt,
      this.configService.get('PASSWORD_ENCRYPT_ITERATIONS'),
      pwdKeylen,
      'sha512',
    );

    return {
      salt,
      password: encryptedPwd,
    };
  }
}
