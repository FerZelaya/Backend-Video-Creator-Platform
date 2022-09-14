import { Request } from 'express';
import { User } from '../models/users.entity';

interface RequestWithUser extends Request {
  sub: number;
  user: { username: User };
}

export default RequestWithUser;
