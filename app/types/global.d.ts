import { Request as ExpressRequest, Response, NextFunction } from 'express';

// declare global {
//   namespace Express {
//     interface Request extends ExpressRequest {
//       usuario_id?: string;
//       body: { [key: string]: string };
//       cookies: { [key: string]: string };
//     }
//   }

//   type CustomRequestHandler = (req: Express.Request, res: Response, next: NextFunction) => void;
// }



declare global {
  namespace Express {
    interface Request {
      usuario_id?: string; // Define the custom property here
    }
  }
}