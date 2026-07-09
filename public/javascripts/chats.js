const socket = io();
const message = document.querySelector('.ipmsg');
const form = document.querySelector('.ipform');
const chat_messages = document.querySelector('.chat_messages');
const chatbox = document.querySelector('.chatbox');
const loadChats = document.querySelector('.loadChats');
const root = document.querySelector('.root');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(message.value.trim()){
        socket.emit('chat message' , {
            conversation : chatbox.dataset.conversationId,
            receiver : chatbox.dataset.inChatUser,
            message : message.value.trim()
        });
        message.value = '';
    }
});
async function loadUserTOChatBox(user){
    let username = user.dataset.username;
    let ConversationId = user.dataset.conversationId;
    let response = await fetch(`/user/search/${username}`);
    let userData ;
    if(response.ok){
        userData = await response.json();
    }

    if(userData){
        chat_messages.innerHTML = "";
        chatbox.dataset.conversationId = user.dataset.conversationId;
        chatbox.dataset.inChatUser = username;
        let profilePic = document.querySelector('.currUserProfilepic');
        let CurrUsername = chatbox.querySelector('.CurrUsername');
        let loadChats = chatbox.querySelector('.loadChats');
        profilePic.setAttribute('src',userData.profilepic.url);
        CurrUsername.setAttribute('href',`/user/view/${username}`);
        CurrUsername.textContent = username;
        // getChats(user.dataset.conversationId , "nopreviousmsg");
    }
}

document.addEventListener('click',(e)=>{
    let UserToBeLoad = e.target.closest('.user');
    if(UserToBeLoad){
        loadUserTOChatBox(UserToBeLoad);
    }
});

(function connectToRoom(){
    socket.emit('Join your chat room', { roomId: "room_123" });
})();

socket.on('chat message', (data)=>{
    console.log(data);
    let alignment = 'self-start';
    if(data.receiver === chatbox.dataset.inChatUser){
        alignment = 'self-end';
    }
    const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    });

    let msg = document.createElement('div');
        msg.innerHTML = `
           <div class="w-fit px-3 py-2 rounded-lg bg-zinc-700">
                <p>${data.message}</p>
                <span class="time text-right text-xs text-zinc-500">${time}</span>
            </div>
        `;
        console.log(msg);
    msg.className = `flex items-center gap-2 ${alignment} m-2`;
    chat_messages.append(msg);
    chat_messages.scrollTop = chat_messages.scrollHeight;
});

function loadMessages(messages){
    messages.forEach(message =>{
        let alignment = 'justify-start';
        if(message.sender.username === root.dataset.curruserName){
            alignment = 'justify-end';
        }
        let time = new Date(message.createdAt).toLocaleTimeString([],{
        hour: "2-digit",
        minute: "2-digit",
        });

        let msg = document.createElement('div');
        msg.innerHTML = `
            <div class="w-fit px-3 py-2 rounded-lg bg-zinc-700">
                <p>${message.message}</p>
                <span class="time text-right text-xs text-zinc-500">${time}</span>
            </div>
        `;
        msg.className = `flex items-center gap-2 ${alignment} m-2  `;
        loadChats.after(msg);
    });

    chatbox.dataset.lastMessageId = messages[messages.length -1]._id;
}

const LoadMoreUSers= new IntersectionObserver(
    async (entries) =>{
        if(entries[0].isIntersecting){
            const conversationId = chatbox.dataset.conversationId;
            const lastMessageId = chatbox.dataset.lastMessageId
            const response = await fetch(`/chats/get/${conversationId}/${lastMessageId}`);
            const messages = await response.json();
            loadMessages(messages); 
            chat_messages.scrollTop = chat_messages.scrollHeight;
            setTimeout(() => {
                chat_messages.scrollTop = chat_messages.scrollHeight;
            }, 500);           
        }
    }
);



if(loadChats){
    LoadMoreUSers.observe(loadChats);
}