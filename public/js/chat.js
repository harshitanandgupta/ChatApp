const socket=io()
const submitbtn=document.getElementById('submit')
const inputfield=document.getElementById(('msg'))
const locationbtn=document.getElementById('location')
const messages=document.getElementById('messages')

//Templates
const msgtemplate=document.getElementById('msgtemplate').innerHTML
const locationtemplate=document.getElementById('locationtemplate').innerHTML
socket.on('message',({msg,createdAt,username})=>{
    console.log(msg)
    const html=Mustache.render(msgtemplate,{
        msg,
        createdAt:moment(createdAt).format('h:mm a'),
        username
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const avatar=username
socket.on('locmsg',({username,location,createdAt})=>{
    console.log(location)
    const html=Mustache.render(locationtemplate,{location,createdAt:moment(createdAt).format('h:mm a'),username})
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

submitbtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const msg=inputfield.value
    if(msg=='')
    return alert('Type in a message to send!')
    submitbtn.setAttribute("disabled","disabled")

    socket.emit('sendmsg',msg,(error)=>{
        submitbtn.removeAttribute("disabled")
        inputfield.value=''
        inputfield.focus()
        if(error)
        console.log(error)
        else
        console.log('Message is Delivered!')
    })
})

locationbtn.addEventListener('click',(e)=>{
    e.preventDefault()
    if(!navigator.geolocation)
    return alert('Geolocation is not supported by your Browser')
    locationbtn.setAttribute("disabled","disabled")

    navigator.geolocation.getCurrentPosition((position)=>{
       // console.log(position.coords.latitude,position.coords.longitude)
       const location=`https://google.com/maps?q=`+position.coords.latitude +','+position.coords.longitude
       socket.emit('sendlocation',location,()=>{
            locationbtn.removeAttribute("disabled")
           console.log('Location Shared Successfully')
       })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
    alert(error)
    location='/'
    }
})

socket.on('sidedata',({room,users})=>{
    console.log(room)
    document.getElementById('room-title').textContent=room.toUpperCase()
    var li=''
    users.forEach(user => {
        li+=`<li>${user.username}</li>`
    });
    document.getElementById('users').innerHTML=li

    //console.log(users)
})

const autoscroll = () => {
    // New message element
    const $messages=document.getElementById('messages')
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}