

const m=  require('./connectDB');
const bcrypt= require('bcrypt');


const User=  m.model('users',new m.Schema({
    username:{
        type:String,
        require:true,
        minlength:1,
        maxlength:225,
    },
    email:{
        type:String,
        require:true,
        unique:true,
        minlength:1,
        maxlength:225,
    },
    password:{
        type:String,
        require:true,
        minlength:1,
        maxlength:1500,
    },
    gender:{
        type:String,
        minlength:1,
        maxlength:10,
        required:true
    },
    role:{
        type:String,
        minlength:1,
        maxlength:10,
        required:true
    },

    concern_history:[
        {
            type:m.Schema.Types.ObjectId,
            ref:'concerns'
        }
    ],
    bids_intrested:[{
        type:m.Schema.Types.ObjectId,
        ref:'doctors'
    }],
    bids_purchased:[{
        type:m.Schema.Types.ObjectId,
        ref:'doctors'
    }],
    cart:[{
        type:m.Schema.Types.ObjectId,
        ref:'doctors'
    }]
}));

let authenticateUser=  async function(user){
    
   let found= await User.findOne({email:user.email,role:user.role});
   if(!found) {console.log("couldnt find the user with email provided");
return false;
}else{
    const match= await bcrypt.compare(user.password,found.password );
    console.log('matched :', match);
    return found;
}

}

let addNewUser=  async function(body){

    console.log("addNewUser Function", body);
    const salt= await bcrypt.genSalt(10); ;
    let add=  await User.findOne({email:body.email});
    if(await add == null){
        const newUser =await new User({
            username:body.name,
            email:body.email,
            password:await bcrypt.hash(body.password,salt),
            gender:body.gender,
            role:body.role,
            concern_history:[],
            bids_intrested:[],
            bids_purchased:[],
            cart:[]
        }).save();
        add= newUser;
        console.log(`new User`, add);
    (newUser)? message="new user added sucessfully" : message='faild adding new user';
    }
    else{
        message="user already exist"
    }
    return {message, add};

}



exports.addNewUser=addNewUser;
exports.authenticateUser= authenticateUser;