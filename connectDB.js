const mongoose = require('mongoose');
const config= require('./config.json');
mongoose.connect(config.localdbURI,{useNewUrlParser:true},()=>{
    console.log(`successfully connected to data base`);
});
module.exports=mongoose;