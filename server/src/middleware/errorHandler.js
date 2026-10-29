import { ZodError } from 'zod';
export function errorHandler(err,req,res,next){
  if(res.headersSent)return next(err);
  if(err instanceof ZodError)return res.status(400).json({error:{code:'INVALID_REQUEST',message:'Please check your input and try again.'}});
  const status=err.status||500;
  if(status>=500)console.error(err);
  const known={400:['INVALID_REQUEST','Please check your input and try again.'],413:['PAYLOAD_TOO_LARGE','The request is too large.'],404:['NOT_FOUND','The requested endpoint was not found.']};
  const fallback=known[status];
  res.status(status).json({error:{code:err.code||fallback?.[0]||'INTERNAL_ERROR',message:fallback?.[1]||((status>=500&&!err.code)?'An unexpected error occurred. Please try again.':err.message)}});
}
export function notFoundHandler(req,res){res.status(404).json({error:{code:'NOT_FOUND',message:'The requested endpoint was not found.'}});}
