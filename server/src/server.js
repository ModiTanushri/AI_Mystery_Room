import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
await connectDatabase();
app.listen(env.PORT,()=>console.log(`API listening on port ${env.PORT}`));
