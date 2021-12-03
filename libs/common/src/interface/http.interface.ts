import { Request, Response } from 'express'
import moduleName from 'module'


export interface AuthenticatedRequest extends Request{
  user: {
    id: string,
    email: string
  }
};

export {
  Response,
  Request
}