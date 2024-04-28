import { Request } from 'express';

export interface ExtendedRequest extends Request {
    usuario_id?: string;
}