module.exports=async function(req,res,next){
    try{
        if(!req.session) res.redirect('/users/login');
        
        
        if(req.path == '/login'|req.path == '/signup'){
            console.log("authorize user :",req.path);
            //res.redirect('/users/concern');
        } 
        console.log('user authorized')
        next();
    }catch(err){
        console.log('error verifying session object');
    }
    };