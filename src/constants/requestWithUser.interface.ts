import { Request } from 'express';
import { User } from '../models/users.entity';

interface RequestWithUser extends Request {
  user: {
    user: User;
  };
}

export default RequestWithUser;
