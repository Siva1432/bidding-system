const express = require('express');
const router = express.Router();

const { addNewUser,authenticateUser } = require('../database/user_queries');
//const {addNewConcern} = require('../concern_queries');




module.exports=function(){

    //authorise users for secure routes-----------------------------------------------
    
    
    router.get('/login',(req, res, next)=>{
        res.render('login');
    });
    router.get('/signup',(req,res,next)=>{
        res.render('signup');
    });


    //login user-----------------------------------------------------------------------------
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

        try{
            (req.session.user.role =='doctor') ? res.redirect('/doctor'): res.redirect('/concern');
        }catch(err){
            console.log('err redirection user');
            throw err;
        }
        
       }
    });
    //login user-----------------------------------------------------------------------------
    
    //signup new user-----------------------------------------------------------------------------
    router.post('/signup',async(req,res,next)=>{
        
        const result= await addNewUser(req.body);
        req.session.regenerate(function(err){
            if (err){
               console.log(err);
            }
         });
         req.session.user=result.add;
         if(req.session.user.role =='doctor') res.redirect('/doctor');
    res.redirect('/concern')
    });
    //signup new user-----------------------------------------------------------------------------
    
    
return router;

}





