import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
const client=new GoogleGenAI({apiKey:env.GEMINI_API_KEY});
export async function generateWithGemini(prompt,timeoutMs=60000){
  let timeout;
  const timedOut=new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Generation timed out')),timeoutMs);});
  let response;
  try{response=await Promise.race([client.models.generateContent({model:env.GEMINI_MODEL,contents:prompt,config:{responseMimeType:'application/json',temperature:0.8}}),timedOut]);}
  finally{clearTimeout(timeout);}
  const text=response.text;
  if(!text)throw new Error('Gemini returned an empty response');
  return JSON.parse(text);
}
