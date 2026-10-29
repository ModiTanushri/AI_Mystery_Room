import mongoose from 'mongoose';
const {Schema}=mongoose;
const suspect=new Schema({id:{type:String,required:true},name:{type:String,required:true},role:String,description:String,motive:String,alibi:String},{_id:false});
const evidence=new Schema({id:{type:String,required:true},type:{type:String,enum:['message','image','call_transcript','document','witness_statement','physical_clue'],required:true},title:String,source:String,timestamp:String,content:Schema.Types.Mixed,relatedSuspectIds:[String]},{_id:false});
const solution=new Schema({culpritId:{type:String,required:true},motive:String,method:String,timeline:[{time:String,event:String}],reasoning:String,evidenceLinks:[{evidenceId:String,explanation:String}]},{_id:false});
const mysteryCase=new Schema({scenario:{type:String,required:true},title:{type:String,required:true},category:String,difficulty:{type:String,enum:['easy','medium','hard']},briefing:String,setting:{location:String,incidentDate:String,incidentTime:String},suspects:[suspect],evidence:[evidence],solution:{type:solution,required:true},status:{type:String,enum:['ready','archived'],default:'ready'}},{timestamps:true});
mysteryCase.index({createdAt:-1});
export default mongoose.model('MysteryCase',mysteryCase);
