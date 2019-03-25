const express=  require('express');
const app=express();
const server=require('http').createServer(app);
const doctorio= require('socket.io').listen(server);
doctorio.set('transports',['polling','websocket']);
const concernio= require('socket.io').listen(server,{
  path:'/concern'
});

const bp=require('body-parser');
const port= process.env.PORT;
const hbs = require('express-handlebars');
const usersRouter= require('./routing/user_router.js')();
const concernRouter= require('./routing/concerns_routing.js')(concernio);
const doctorsRouter= require('./routing/doctors_routing.js')(doctorio);
const session= require('express-session');
const config= require('./config.json');


//app.use(cp.JSONCookie);


app.engine('hbs',hbs({defaultLayout:'main',extname:'hbs'}));
//app.set('views','./views');
app.set('view engine','hbs')

app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/',secure:false,maxAge:  1800000 },    
  }));


app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use('/users',usersRouter);
app.use('/concern',concernRouter);
app.use('/doctor',doctorsRouter);
// let socket=io.on('connection',(socket)=>{
//   console.log('new users connected',socket.client);
// });

server.listen(port || 4200,()=>{
  console.log(`server listening on port ${port ? port : 4500} ` );
});



