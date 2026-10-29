export class AppError extends Error { constructor(status,code,message){super(message);this.status=status;this.code=code;} }
export const notFound=()=>new AppError(404,'NOT_FOUND','The requested case or investigation could not be found.');
export const unauthorized=()=>new AppError(401,'INVALID_SESSION','This investigation session is missing or invalid.');
