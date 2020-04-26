const users=[]

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!room || !username)
    {
        return {'error':'You must give username and room'}
    }

    const existing=users.find((user)=>{
        return user.room===room && user.username===username 
    })

    if(existing)
    return {'error':'Username in use!'}

    users.push({id,username,room})
    return {id,username,room}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1)
    return users.splice(index,1)[0]
}

const getUser=(id)=>{
    const user=users.find((user)=>user.id===id)
    if(user)
    return user
}
const getUsersInRoom=(room)=>{
    const usersinroom=[]
    users.forEach((user)=>{
        if(user.room==room)
        usersinroom.push(user)
    })
    return usersinroom
 }

module.exports={
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}