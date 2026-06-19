const imageInput = document.querySelector('#images');
const previewContainer = document.querySelector('#previewContainer');
// const likebtns = document.querySelectorAll('.likebtn');
const createPostBtn= document.querySelectorAll('.createPostBtn');
const createpostform = document.querySelector('.createpostform');
const previousImageButtons = document.querySelectorAll('.prev-img-btn');
// const nextImageButtons = document.querySelectorAll('.next-img-btn');
const loder = document.querySelector('#loader');
const userPostsLoder = document.querySelector('#userPostsLoder');

const allposthere = document.querySelector('.allposthere');
const uploadPostbtn = document.querySelector('.uploadPostbtn');
const uploadPostForm = document.querySelector('.uploadPostForm');
const images = document.querySelector("#images");
const formErrorMsg = document.querySelector('.formErrorMsg');
const content = document.querySelector('.content');

imageInput.addEventListener('change', () => {
    previewContainer.innerHTML = '';
    [...imageInput.files].forEach(file => {

        const reader = new FileReader();

        reader.onload = e => {

            const img = document.createElement('img');

            img.src = e.target.result;

            img.className =
                'w-full h-40 object-cover rounded-xl';

            previewContainer.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});

async function handleLike(likebtn){
        let icon = likebtn.querySelector('i');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('text-red-400');

        count = likebtn.querySelector('span');
        
        if(icon.classList.contains('fa-solid')){
            count.textContent = Number(count.textContent) +1;
        }else{
            count.textContent = Number(count.textContent) -1;
            if(Number(count.textContent) <0)
                count.textContent = 0;
        }
        const postId = likebtn.dataset.postId;
        try {
            console.log("REquest Initiated");
            const response = await fetch(
                `/post/like/${postId}`,
                {
                    method: 'POST'
                }
            );
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
}

function handleNextImage(btn){
        let parent = btn.parentElement ;
        let image = parent.querySelector('img');
        let currentIdx = Number(image.dataset.imgNo);
        let images = JSON.parse(image.dataset.images);
        currentIdx++;
        if(currentIdx>=images.length){
            currentIdx = images.length -1  ;
        }
        let imageNodiv = parent.querySelector('.imageNodiv');
        imageNodiv.textContent = `${currentIdx+1}/${images.length}`;
        image.src = images[currentIdx].url ;
        image.dataset.imgNo = currentIdx ;
}

function handlePrevImage(btn){
        let parent = btn.parentElement ;
        let image = parent.querySelector('img');
        let currentIdx = Number(image.dataset.imgNo);
        let images = JSON.parse(image.dataset.images);
        currentIdx--;
        if(currentIdx<0){
            currentIdx = 0 ;
        }
        let imageNodiv = parent.querySelector('.imageNodiv');
        imageNodiv.textContent = `${currentIdx+1}/${images.length}`;
        image.src = images[currentIdx].url ;
        image.dataset.imgNo = currentIdx ;
}

async function handelPostDelete(deletePostBtn){
    const postId = deletePostBtn.dataset.postId;
    try{
        let response = await fetch(`/post/delete/${postId}`,{method : 'post'});
        deletePostBtn.disabled = true;
    }catch(err){
        console.log("Failed to Delete post");
    }
    window.location.reload();
    return ;
}
uploadPostForm.addEventListener('submit' , (e)=>{
    console.log('clicked');
    formErrorMsg.innerHTML = "";

    if(images.files.length == 0 && content.value.trim()===""){
        console.log("prevent defaluted");
        e.preventDefault();
        let p = document.createElement('p');
        p.textContent = "Please writes something or upload a picture";
        formErrorMsg.appendChild(p);
        return ;
    }
    setTimeout(()=>{
        uploadPostbtn.disabled = true;
    },10000);
});

document.addEventListener('click', async (e) => {

    const likebtn = e.target.closest('.likebtn');
    if(likebtn){
        likebtn.disabled = true ;
        await handleLike(likebtn);
        setTimeout(()=>{
            likebtn.disabled = false;
        },2000);
        return;
    }

    // const commentbtn = e.target.closest('.commentbtn');
    // if(commentbtn){
    //     handleComment(commentbtn);
    //     return;
    // }

    const nextbtn = e.target.closest('.next-img-btn');
    if(nextbtn){

         handleNextImage(nextbtn);
        return;
    }

    const prevbtn = e.target.closest('.prev-img-btn');

    if(prevbtn){
         handlePrevImage(prevbtn);
        return;
    }

    const deletePostBtn = e.target.closest('.deletePostBtn');

    if(deletePostBtn){
        await handelPostDelete(deletePostBtn);
        return;
    }

});



createPostBtn.forEach(btn =>{
    btn.addEventListener('click',()=>{
    createpostform.classList.toggle('hidden');
});
});

// Load POSTS 
function loadPost(posts){
    posts.forEach( post =>{
        let postCreationDate = new Date(post.createdAt).toLocaleDateString();
        if(!post.content){
            post.content="";
        }
        let likebtnContent = `<i class="fa-regular fa-heart text-xl"></i>`;
        if(!post.user.profilepic.url){
            post.user.profilepic.url = `https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781797010/defalut_wc1tfy.webp`;
        }
        if(post.isLiked){
            likebtnContent =`
                <i class="fa-solid fa-heart text-xl text-red-400"></i>             
            `;
        }

        let postImages = JSON.stringify(post.images);
        let hasImages ="";
        if(post.images.length > 1){ 
            hasImages = `
             <div class="relative group">
                        <img
                            src="${post.images[0].url}"
                            data-img-no="0"
                            data-images='${postImages}'
                            alt="post image"
                            class="w-full h-[500px] object-cover postimage">

                            <div class="absolute right-3 top-3 imageNodiv px-1 bg-zinc-900 rounded-lg">
                                1/${post.images.length}
                            </div>
                            <button
                        class="prev-img-btn absolute left-3 top-1/2 -translate-y-1/2
                            hidden group-hover:flex
                            items-center justify-center
                            w-10 h-10 rounded-full
                            bg-black/50 text-white">
                        ❮
                             <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <button
                        class="next-img-btn absolute right-3 top-1/2 -translate-y-1/2
                            hidden group-hover:flex
                            items-center justify-center
                            w-10 h-10 rounded-full
                            bg-black/50 text-white">
                        ❯
                            <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            
            `
        }else if(post.images.length > 0){
            hasImages = `
            <div class="relative group">
                        <img
                            src="${post.images[0].url}"
                            data-img-no="0"
                            data-images='${postImages}'
                            alt="post image"
                            class="w-full h-[500px] object-cover postimage">
                </div>
            `
        }
        
        let  deletepostBtnDiv ='';
        
        if(post.user.username.toString().trim()===post.curruser.toString().trim()){
            deletepostBtnDiv= `
            <div class="flex justify-center items-center text-red-500 ml-auto mr-5">
                <button class="deletePostBtn" data-post-id="${post._id}">
                    <i class="fa-solid fa-trash-can text-red-500"></i>
                </button>
            </div>
            `;
        }
        // console.log(deletepostBtnDiv);

        let article = document.createElement('article');
        article.innerHTML = `
            <article
                class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
                <div class="flex items-center gap-3 p-4">
                    <a href="/user/view/${post.user.username }">
                        <img
                            src="${post.user.profilepic.url}"
                            class="w-12 h-12 rounded-full object-cover"
                            alt="profile">
                    </a>
                    <div>
                        <a
                            href="/user/view/${post.user}"
                            class="font-semibold hover:text-blue-400">
                            @${post.user.username}
                        </a>
                        <p class="text-xs text-zinc-400">
                             ${postCreationDate}
                        </p>
                    </div>
                    ${deletepostBtnDiv}
                </div>

                ${hasImages}

                    <div class="px-4 py-3">
                        <p class="whitespace-pre-line">
                            ${post.content}
                        </p>
                    </div>

                <div
                    class="flex items-center justify-between px-4 py-3 border-t border-zinc-800">

                    <div class="flex items-center gap-6">
                        <button
                            class="likebtn flex items-center gap-2 hover:text-red-400" data-post-id="${post._id}">
                            ${likebtnContent}
                            <span>
                                ${post.likeCount}
                            </span>
                        </button>
                        <button
                            class="flex commentbtn items-center gap-2 hover:text-blue-400">
                            <i class="fa-regular fa-comment text-xl"></i>
                            <span>
                                ${post.commentCount}
                            </span>
                        </button>
                    </div>
                </div>
        `;
        allposthere.appendChild(article);
    });

}



let page = 1;


const observer = new IntersectionObserver(
    async (entries) => {
        if(entries[0].isIntersecting){
            const response = await fetch(
                `/feed?page=${page}`
            );
            const posts = await response.json();
            page++;
            loadPost(posts)  
        }
    }
);

const userposts= new IntersectionObserver(
    async (entries) =>{
        if(entries[0].isIntersecting){
            const id = userPostsLoder.dataset.userId;
            const response = await fetch(`/user/posts/${id}?page=${page}`);
            const posts = await response.json();
            page++;
            loadPost(posts);
        }
    }
);
if(loder){
    observer.observe(loader);
}
if(userPostsLoder){
    userposts.observe(userPostsLoder);
}
