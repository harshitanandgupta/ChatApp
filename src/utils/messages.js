const generatemsg=(username,msg)=>{
    return {
        username,
        msg,
        createdAt:new Date().getTime()
    }
}
const generatelocmsg=(username,location)=>{
    return {
        username,
        location,
        createdAt:new Date().getTime()
    }
}
module.exports={
    generatemsg,
    generatelocmsg
}