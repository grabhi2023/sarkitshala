import mongoose ,{Schema} from "mongoose";

let SearchSchema= new Schema({
ExperimentName:{
    type:String
},
ExperimentId:{
    type:Number
},
slug:{
    type:String
},
})

export const searchExp = mongoose.models.searchExps || mongoose.model('searchExps',SearchSchema)
