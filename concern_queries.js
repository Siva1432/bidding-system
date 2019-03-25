

const m=  require('./connectDB');


const concern=  m.model('concerns',new m.Schema({
    title:{
        type:String,
        require:true,
        minlength:1,
        maxlength:225,
        trim:true
    },
    
    description:{
        type:String,
        minlength:1,
        maxlength:1500
        
    },
    postedBy:{
        type:m.Schema.Types.ObjectId,
        ref:"users"
    },

    bids:[{
        price:{
            type:Number,
            min:1
        },
        doctor:{
        type:m.Schema.Types.ObjectId,
        ref:'doctors'
    }}],
    
}));


let addNewConcern=  async function(body,user){
    console.log("addNewConcern Function", body,user);
   
    
    
        const newConcern =await new concern({
            title:body.title,
            description:body.description,
            postedBy:user._id,
            bids:[]           
        }).save();
        
        console.log(`new concern added`);
    
    return newConcern;

}

let getAll= async function(query){
    return await concern.find({},'_id title description');
}


let findConcern = async function(id){
    return await concern.findById(id).populate('postedBy','username role gender');;
}
exports.addNewConcern = addNewConcern;
exports.getAll=getAll;
exports.findConcern=findConcern;