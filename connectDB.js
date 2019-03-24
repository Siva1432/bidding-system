const mongoose = require('mongoose');
const config= require('./config.json');
mongoose.connect(config.mlabdbURI,{useNewUrlParser:true},()=>{
    console.log(`successfully connected to data base`);
});
module.exports=mongoose;