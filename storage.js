module.exports=()=>(req, res, next)=>{
    //todo import and decorate services
    req.storage={};

    next();
}