import { z } from 'zod';
export const createCaseSchema=z.object({scenario:z.string().trim().min(20).max(2000),category:z.string().max(40).optional(),difficulty:z.enum(['easy','medium','hard']).default('medium'),suspectCount:z.number().int().min(3).max(6).default(4)}).strict();
const suspect=z.object({id:z.string().min(1),name:z.string().min(1),role:z.string().min(1),description:z.string().min(1),motive:z.string().min(1),alibi:z.string().min(1)}).strict();
const evidence=z.object({id:z.string().min(1),type:z.enum(['message','image','call_transcript','document','witness_statement','physical_clue']),title:z.string().min(1),source:z.string().min(1),timestamp:z.string().optional(),content:z.record(z.unknown()),relatedSuspectIds:z.array(z.string())}).strict();
export const generatedCaseSchema=z.object({title:z.string().min(1),category:z.string().min(1),difficulty:z.enum(['easy','medium','hard']),briefing:z.string().min(1),setting:z.object({location:z.string(),incidentDate:z.string(),incidentTime:z.string()}).strict(),suspects:z.array(suspect).min(3).max(6),evidence:z.array(evidence).min(6).max(10),solution:z.object({culpritId:z.string(),motive:z.string(),method:z.string(),timeline:z.array(z.object({time:z.string(),event:z.string()}).strict()).min(2),reasoning:z.string(),evidenceLinks:z.array(z.object({evidenceId:z.string(),explanation:z.string()}).strict()).min(2)}).strict()}).strict();
export function checkConsistency(c,expectedCount){
  const suspectIds=c.suspects.map(s=>s.id),evidenceIds=c.evidence.map(e=>e.id);
  if(c.suspects.length!==expectedCount)throw new Error('Suspect count does not match request');
  if(new Set(suspectIds).size!==suspectIds.length||new Set(evidenceIds).size!==evidenceIds.length)throw new Error('Duplicate IDs');
  if(!suspectIds.includes(c.solution.culpritId))throw new Error('Unknown culprit');
  if(c.evidence.some(e=>e.relatedSuspectIds.some(id=>!suspectIds.includes(id))))throw new Error('Evidence references an unknown suspect');
  if(c.solution.evidenceLinks.some(l=>!evidenceIds.includes(l.evidenceId)))throw new Error('Solution references unknown evidence');
  if(new Set(c.solution.evidenceLinks.map(l=>l.evidenceId)).size<2)throw new Error('Solution needs multiple evidence items');
  return c;
}
