const imageInput = document.querySelector('#images');
const previewContainer = document.querySelector('#previewContainer');

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
