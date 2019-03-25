const express = require('express');
const {addNewConcern}= require('../database/concern_queries');
const router = express.Router();
const authorize= require('./middlewares/authorize');

module.exports=function(io){
    // io.sockets.on('connection',(socket)=>{
    //     console.log('new user connected in concern rotuer');
        
    // });

    router.get('/bids',(req,res,next)=>{})
    router.post('/',authorize,async(req,res,next)=>{
    console.log('posting new concern');   
    let concern = await addNewConcern(req.body,req.session.user)
    if(!concern) {console.log('failed to add concern'),res.redirect('/concern');}
    else{
        console.log('broadcasting new concern');
        
       if(await socket) socket.broadcast.emit('new concern added',concern);
        res.redirect('/bids');
    }
    });

    router.post('/',authorize,async(req,res,next)=>{
        console.log('posting new concern');   
        let concern = await addNewConcern(req.body,req.session.user)
        if(!concern) {console.log('failed to add concern'),res.redirect('/concern');}
        else{
            console.log('broadcasting new concern');
            try{
                if(await socket) socket.broadcast.emit('new concern added',concern);
                res.redirect('/bids');
            }catch(err){
                console.log('err redirecting ');
                throw err
            }
          
        }
        })

    router.get('/', authorize,(req,res,next)=>{
        res.render('concern');
    });
    return router;
}

