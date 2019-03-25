

const m=  require('./connectDB');
const bidSchema= require('./bid_queries');
const userModel=require('./user_queries').userModel;


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
        doctor:Object
        ,notes:{
        type:String,
        maxlength:1000
    }
}],
    
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

let addNewBid=async function(bid){
    
    
    try{
        console.log('finding the concern with roomId');
        let doctor= await userModel.findById(bid.doctorId,'username gender role');
        console.log('found docter with id',doctor);
        const bidObj={
            price:bid.price,
            doctor:doctor,
            notes:bid.notes
        };
        let changeConcern= await concern.findById(bid.id);
        changeConcern.bids.push(bidObj);
        //console.log('updating the concern with roomId',changeConcern);
        let updatedConcern= await concern.findByIdAndUpdate(bid.id,{$set:{bids:changeConcern.bids}},{new:true});
        let updatedBidsArr=[];
        if(await updatedConcern){
            console.log('updatedconcern  ::',updatedConcern);
            return updatedConcern;
        }
    }catch(err){
        console.log('error while adding new bid',err);
    }
    }
let findConcern = async function(id){
    return await concern.findById(id).populate('postedBy','username role gender');;
}
exports.addNewConcern = addNewConcern;
exports.getAll=getAll;
exports.findConcern=findConcern;
exports.addNewBid =addNewBid