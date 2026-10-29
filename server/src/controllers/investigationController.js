import { getProgress,openEvidence,submitVerdict,getResults } from '../services/investigationService.js';
export async function progress(req,res){res.json(await getProgress(req.params.investigationId,req.get('X-Investigation-Token')));}
export async function markOpened(req,res){res.json(await openEvidence(req.params.investigationId,req.params.evidenceId,req.get('X-Investigation-Token')));}
export async function verdict(req,res){res.json(await submitVerdict(req.params.investigationId,req.get('X-Investigation-Token'),req.body));}
export async function results(req,res){res.json(await getResults(req.params.investigationId,req.get('X-Investigation-Token')));}
