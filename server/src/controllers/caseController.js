import { createCase,createDemoCase,getCase } from '../services/investigationService.js';
export async function postCase(req,res){const data=await createCase(req.body);res.status(201).json(data);}
export async function postDemoCase(req,res){const data=await createDemoCase();res.status(201).json(data);}
export async function retrieveCase(req,res){res.json(await getCase(req.params.caseId));}
