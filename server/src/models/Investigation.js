import mongoose from 'mongoose';
const {Schema}=mongoose;
const investigation=new Schema({caseId:{type:Schema.Types.ObjectId,ref:'MysteryCase',required:true,index:true},sessionTokenHash:{type:String,required:true,index:true},openedEvidenceIds:{type:[String],default:[]},selectedSuspectId:{type:String,default:null},explanation:{type:String,default:''},verdictSubmitted:{type:Boolean,default:false},isCorrect:{type:Boolean,default:null},submittedAt:{type:Date,default:null}},{timestamps:true});
investigation.index({createdAt:1},{expireAfterSeconds:60*60*24*30});
export default mongoose.model('Investigation',investigation);
