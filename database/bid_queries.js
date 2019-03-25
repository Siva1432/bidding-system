const m=  require('./connectDB');


const bidSchema=   m.Schema({  
    notes:{
        type:String,
        minlength:1,
        maxlength:1000
        
    },
    postedBy:{
        type:m.Schema.Types.ObjectId,
        ref:"users"
    },

    price:{
        type:Number,
        min:1,
        required:true
    }
    
});

module.exports=bidSchema;