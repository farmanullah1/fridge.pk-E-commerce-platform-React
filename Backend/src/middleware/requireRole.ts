import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'You do not have permission for this action' });
      return;
    }
    next();
  };
}
