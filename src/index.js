const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generatemsg,generatelocmsg}=require('../src/utils/messages')
const {addUser,getUser,removeUser,getUsersInRoom}=require('./utils/users')
const app=express()
const port=process.env.PORT || 3000
const publicdir=path.join(__dirname,'../public')
const server=http.createServer(app)
app.use(express.static(publicdir))//Setting the public directory path
const io=socketio(server)//Creating Socket io Instance
io.on('connection',(socket)=>{
    console.log("WebSocket Initiated")
    

    socket.on('join',({username,room},callback)=>{
        const user=addUser({id:socket.id,username,room})
        if(user.error)
        return callback(user.error)
        socket.join(user.room)
        socket.emit('message',generatemsg('Admin','Welcome User'))
        socket.broadcast.to(user.room).emit('message',generatemsg('Admin',`${user.username} has joined`))
        io.to(user.room).emit('sidedata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })


    socket.on('sendmsg',(msg,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(msg))
        return callback('Profanity is Not allowed')
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generatemsg(user.username,msg))
        callback()
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user)
        io.to(user.room).emit('message',generatemsg('Admin',`${user.username} has Left!!`))
        io.to(user.room).emit('sidedata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })

    socket.on('sendlocation',(location,callback)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('locmsg',generatelocmsg(user.username,location))
    callback()
    })
})
server.listen(port,()=>{
    console.log(`Server running on ${port}`)
})