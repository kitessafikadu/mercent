// src/auth/interfaces/authenticated-request.interface.ts

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string; // Define the userId field that comes from the JWT payload
  };
}
