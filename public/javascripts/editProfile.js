let input = document.querySelector("#uploadedImage");
let profilepic = document.querySelector("#profilepic");
input.addEventListener('change',(obj)=>{
    let file = obj.target.files[0];
    let imageLink = URL.createObjectURL(file);
    profilepic.setAttribute('src' , String(imageLink));
});
