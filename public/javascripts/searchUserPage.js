// const { createElement } = require("react");

// const search = document.querySelector('.search');
const usernameIp = document.querySelector('.usernameIp');
const result = document.querySelector('.result');
let searchTimeout ;


usernameIp.addEventListener('input',async (e)=>{

    clearTimeout(searchTimeout);

        searchTimeout = setTimeout( async ()=>{
            const username = usernameIp.value.trim()
            const  response = await fetch(`/user/search/${username}`);
            const user = await response.json();
            result.classList.add('mt-5');
            if(user.found){
                result.innerHTML = "";
                let userdiv = document.createElement('div');
                userdiv.innerHTML = `
                    <div class="min-w-64 flex bg-zinc-700 px-4 py-4 rounded-3xl">
                            <div class="profilepic h-12 w-12 rounded-full mr-2">
                                <img src="${user.profilepic}" alt="profilepic" class="w-full h-full object-cover rounded-full">
                            </div>
                            <div>
                                <a href="/user/view/${user.username}" class="text-blue-400">@${user.username}</a>
                                <p class="font-bold">${user.name}</p>
                            </div>
                    </div>
                `;
                
                result.appendChild(userdiv);
            }else{
                result.innerHTML = "";
                let msg = document.createElement('p');
                msg.textContent = "no user found"; 
                result.appendChild(msg);
            }
        }, 1000);
})