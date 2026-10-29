import rateLimit from 'express-rate-limit';
const response={error:{code:'RATE_LIMITED',message:'Too many requests. Please wait a moment and try again.'}};
export const generationLimiter=rateLimit({windowMs:60*60*1000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:response});
export const verdictLimiter=rateLimit({windowMs:60*60*1000,limit:20,standardHeaders:'draft-7',legacyHeaders:false,message:response});
