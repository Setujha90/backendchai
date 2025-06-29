import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';  //it is used to paginate the results of an aggregation query

const videoSchema=new Schema({
   videoFile:{
       type:String,   //URL from cloudinary service
       required:true
   },

    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
      
    },
    description:{
        type:String, 
        required:true,
        trim:true,
        lowercase:true
    },

    duration:{
        type:Number,
        required:true
    },

    views:{
        type:Number,
        default:0
    },

    isPublished:{
        type:Boolean,
        default:true
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },




},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate); //plugin to paginate the results of an aggregation query

export const Video=mongoose.model("Video",videoSchema);