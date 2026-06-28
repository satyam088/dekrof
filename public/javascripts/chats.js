const socket = io();
const message = document.querySelector('.ipmsg');
const form = document.querySelector('.ipform');
const chat_messages = document.querySelector('.chat_messages');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(message.value){
        console.log('I sent ', message.value);
        socket.emit('chat message' , message.value);
        message.value = '';
    }
});

socket.on('connect',()=>{
    console.log('connected : ', socket.id);
});

socket.on('chat message', (msg)=>{
    let chat = document.createElement('div');
    chat.innerHTML = msg ;
    console.log("I received ",msg);
    chat_messages.appendChild(chat);
    window.scrollTo(0, chat_messages.scrollHeight);

});