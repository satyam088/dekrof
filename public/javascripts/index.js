const imageInput = document.querySelector('#images');
const previewContainer = document.querySelector('#previewContainer');
// const likebtns = document.querySelectorAll('.likebtn');
const createPostBtn= document.querySelectorAll('.createPostBtn');
const createpostform = document.querySelector('.createpostform');
const previousImageButtons = document.querySelectorAll('.prev-img-btn');
// const nextImageButtons = document.querySelectorAll('.next-img-btn');
const loder = document.querySelector('#loader');
const allposthere = document.querySelector('.allposthere');

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
        image.src = images[currentIdx].url ;
        image.dataset.imgNo = currentIdx ;
}


document.addEventListener('click', async (e) => {

    const likebtn = e.target.closest('.likebtn');
    if(likebtn){
        await handleLike(likebtn);
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

});



createPostBtn.forEach(btn =>{
    btn.addEventListener('click',()=>{
    console.log("HEEEY");
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
        if(!post.user.profilepic){
            post.user.profilepic = `https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781707471/default_rbs439.webp`;
        }
        console.log(post.isLiked);
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

        let article = document.createElement('article');
        article.innerHTML = `
            <article
                class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
                <div class="flex items-center gap-3 p-4">
                    <a href="/user/view/${post.user.username }">
                        <img
                            src="${post.user.profilepic}"
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



let page = 2;


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

observer.observe(loader);