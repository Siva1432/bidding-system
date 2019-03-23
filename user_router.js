const express = require('express');
const jwt= require('jsonwebtoken');
const router = express.Router();
const config =require('./config.json');
const {io}=require('./server');
const { addNewUser,authenticateUser } = require('./user_queries');
const {addNewConcern} = require('./concern_queries');
//authorise users for secure routes
const authorize =async function(req,res,next){
try{
    if(!req.session) res.redirect('/users/login');
    
    
    if(req.path == '/login'|req.path == '/signup'){
        console.log("authorize user :",req.path);
        //res.redirect('/users/concern');
    } 
    next();
}catch(err){
    console.log('error verifying the jwt token');
}
};


router.get('/login',authorize,(req, res, next)=>{
    res.render('login');
});
router.get('/signup',authorize,(req,res,next)=>{
    res.render('signup');
});
router.post('/login',async (req,res,next)=>{
    console.log('got the req body for login ',req.body);
   const authenticate=await authenticateUser(req.body);
   if(!authenticate){
       console.log("sorry authentication failed");
   }else{
    req.session.regenerate(function(err){
        if (err){
           console.log(err);
        }
     });
     req.session.user=authenticate;
    
       res.redirect('/users/concern');
   }
});


router.post('/signup',async(req,res,next)=>{
    
    const {message,user}= await addNewUser(req.body);
    req.session.regenerate(function(err){
        if (err){
           console.log(err);
        }
     });
     req.session.user=user;
  
//     console.log('got signup result object', signUp);
// const token=await jwt.sign({name:signUp.name,id:signUp._id},config.secureKey);
// res.setHeader('x-auth-token',await token);

res.redirect('http://localhost:4200/users/concern')
});

router.post('/concern',authorize,async(req,res,next)=>{
    console.log(req.session);
let concern = await addNewConcern(req.body,req.session.user)
if(!concern) {console.log('failed to add concern'),res.redirect('/concern');}
else{
    console.log('broadcasting new concern',concern);
    const socket=io.on('connection',(socket)=>{
        socket.broadcast(concern);
    });
    
    res.redirect('/bids');
}
});
router.get('/concern',authorize,(req,res,next)=>{
    res.render('concern');
});




exports.usersRouter=router;