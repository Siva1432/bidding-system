const express = require('express');
const {getAll,findConcern}= require('../concern_queries');
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
        
            socket.on('getconcern',async(id)=>{
                console.log(`sending concer with id :${roomId}`);
            const getconcern= await findConcern(roomId);
            if(!getconcern) socket.emit('no concern');
            else{
                console.log(`sending concer with id :${id}`);
                socket.emit('concern',getconcern);
            }
            });
    });


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
    router.get('/:id',async function (req,res,next){
       
        const id=req.params.id;
        this.roomId=id;
        console.log('rendering the concernroom with id:',id);
        res.render('concernroom',{id:id});
    })
    router.get('/', authorize,async (req,res,next)=>{
        res.render('bidconcerns');       
    });
    return router;
}

