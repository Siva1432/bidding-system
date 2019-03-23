const express=  require('express');
const app=express();
const server=require('http').createServer(app);
const io= require('socket.io')(server);
const bp=require('body-parser');
const port= process.env.PORT;
const hbs = require('express-handlebars');
const handlebars= require('handlebars');
const {usersRouter}= require('./user_router.js');
const session= require('express-session');
const config= require('./config.json');
const cp= require('cookie-parser');

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

server.listen(port || 4500,()=>{
    console.log(`server listening on port ${port ? port : 4500} ` );
});

exports.io=io;