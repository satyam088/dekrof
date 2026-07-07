const followToggle = document.querySelector('.followToggle');
const username = document.querySelector('.username');
const followersCount = document.querySelector('.followersCount');

if(followToggle){
    followToggle.addEventListener('click',async (e)=>{
        followToggle.disabled = true;
        
        try{
            const start = performance.now();
            let response = await fetch(`/user/follow/${username.textContent}`,{
                method : 'post'
            });
            if(response.ok){
                followToggle.textContent = followToggle.textContent.trim() === 'follow'?'following':'follow';
                if(followToggle.textContent==='following'){
                    console.log(followersCount.textContent);
                    followersCount.textContent = Number(followersCount.textContent) + 1;
                }else{
                    console.log(followersCount.textContent);
                    followersCount.textContent = Number(followersCount.textContent) - 1;
                    if(Number(followersCount.textContent)<0){
                        followersCount.textContent = 0;
                    }
                }
            }
            const end = performance.now();
            console.log(`time taken in follow/unfollow : ${(end - start).toFixed(2)} mx`);
        } finally{
            setTimeout(()=>{
                followToggle.disabled = false;
            },3000);
        }
    });
}


