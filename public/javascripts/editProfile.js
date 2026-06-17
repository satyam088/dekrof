let input = document.querySelector("#uploadedImage");
let profilepic = document.querySelector("#profilepic");

let delprofilepic = document.querySelector('.delprofilepic');
let decision = document.querySelector('.decision');
input.addEventListener('change',(obj)=>{
    let file = obj.target.files[0];
    let imageLink = URL.createObjectURL(file);
    profilepic.setAttribute('src' , String(imageLink));
});

delprofilepic.addEventListener('click',async(dets)=>{
    dets.preventDefault();
    decision.name = "delete";
    profilepic.src = 'https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781707471/default_rbs439.webp';
})
