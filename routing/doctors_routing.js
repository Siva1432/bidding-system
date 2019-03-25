const express = require('express');
const {addNewConcern,getAll,findConcern,addNewBid}= require('../database/concern_queries');
const router = express.Router();
const authorize= require('./middlewares/authorize');

module.exports=function(io){


    let roomId;
    io
    .of('/doctor')
    .on('connection',async (socket)=>{
        console.log('new user connected in doctors router');
        let arr= await getAll();
        console.log('emitting the concerns array');
        socket.emit('concerns',arr);
        console.log('emitted the concerns array');
        socket.on('getconcern',async (id)=>{
                   const getconcern= await findConcern(id);
                   if(!getconcern) socket.emit('no concern');
                   else{
                       console.log(`sending concer with id :${id}`);
                       socket.emit('concern',getconcern);
                      }
            
                   });
        
        
    });
    io
    .of('/room')
    .on('connection',async (socket)=>{
        console.log(`new user connected to rooms`);
        //send concerns to doctor --------------------------------
            socket.on('getconcern',async(id)=>{
                console.log(`sending concer with id :${id}`);
            const getconcern= await findConcern(id);
            if(!getconcern) socket.emit('no concern');
            else{
                console.log(`sending concer with id :${id}`);
                socket.emit('concern',await getconcern);
            }
            });


        //get newbids------------
        socket.on('newbid',async function(bid){
            console.log('adding new bid',bid);
            const result=await addNewBid(bid);
            console.log('result of addNewBid',result);
            if(result.updatedConcern.bids.length>0){
                socket.emit('newbidadded',{bid:result.updatedConcern.bids[result.index],index:result.index});
                socket.broadcast.emit('newbidadded',{bid:result.updatedConcern.bids[result.index],index:result.index})
                console.log('new bid added socket emitted');
            }
        })
    });


    ;
    router.get('/:id',async function (req,res,next){
       
        const id=req.params.id;
        this.roomId=id;
        console.log('rendering the concernroom with id:',id);
        res.render('concernroom',{id:id,doctorId:req.session.user._id});
    })
    router.get('/', authorize,async (req,res,next)=>{
        res.render('bidconcerns');       
    });
    return router;
}

