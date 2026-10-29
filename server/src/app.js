import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import caseRoutes from './routes/caseRoutes.js';
import investigationRoutes from './routes/investigationRoutes.js';
import { errorHandler,notFoundHandler } from './middleware/errorHandler.js';
const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin,callback){
    const viteFallback=env.NODE_ENV==='development'&&/^http:\/\/localhost:517\d+$/.test(origin||'');
    callback(null,!origin||origin===env.CLIENT_ORIGIN||viteFallback);
  },
  allowedHeaders:['Content-Type','X-Investigation-Token']
}));
app.use(express.json({limit:'32kb'}));
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use('/api/cases',caseRoutes);
app.use('/api/investigations',investigationRoutes);
if(env.NODE_ENV==='production'){
  const clientDist=fileURLToPath(new URL('../../client/dist/',import.meta.url));
  app.use(express.static(clientDist));
  app.get('*',(req,res,next)=>{
    if(req.path.startsWith('/api/'))return next();
    res.sendFile(path.join(clientDist,'index.html'),err=>{if(err)next(err);});
  });
}
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
