import crypto from 'node:crypto';
import { env } from '../config/env.js';
export const createSessionToken=()=>crypto.randomBytes(32).toString('base64url');
export const hashToken=token=>crypto.createHmac('sha256',env.SESSION_SECRET).update(token).digest('hex');
