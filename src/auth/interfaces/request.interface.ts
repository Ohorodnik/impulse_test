import { JwtPayload } from '../dto/jwt-payload.dto';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}

export interface GuardedRequest extends Request {
  user: JwtPayload;
}
