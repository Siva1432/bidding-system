

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
        
        let index= iterativeFunction(changeConcern.bids, bid.price);
        changeConcern.bids.splice(index,0,bidObj)
        //console.log('updating the concern with roomId',changeConcern);
        let updatedConcern= await concern.findByIdAndUpdate(bid.id,{$set:{bids:changeConcern.bids}},{new:true});
    
        if(await updatedConcern){
            console.log('updatedconcern  ::',updatedConcern);
            return {updatedConcern,index};
        }
    }catch(err){
        console.log('error while adding new bid',err);
    }
    }

    let iterativeFunction = function (arr, x) { 
   
        let start=0, end=arr.length-1; 
              
        // Iterate while start not meets end 
        while (start<=end){ 
      
            // Find the mid index 
            let mid=Math.floor((start + end)/2); 
            // console.log(arr[mid]+"  "+(arr[mid]-2)+"   "+(arr[mid]+2)+"  "+x);
            // If element is present at mid, return True 
            if (x>=(arr[mid].price-2) && x<=(arr[mid].price+2) )return -1;
            // Else look in left or right half accordingly 
        else if (x>(arr[mid].price+2))  
        start = mid + 1; 
   else if(x<(arr[mid].price-2))
        end = mid - 1; 
   
} 

 return start;


} 



let findConcern = async function(id){
    return await concern.findById(id).populate('postedBy','username role gender');;
}
exports.addNewConcern = addNewConcern;
exports.getAll=getAll;
exports.findConcern=findConcern;
exports.addNewBid =addNewBid