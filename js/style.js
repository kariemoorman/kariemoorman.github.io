const imageContainers = document.querySelectorAll('.carousel-images .image');
const mainImage = document.querySelector('.main-image');
const imageTitle = document.querySelector('.image-title');
let currentIndex = 0;

// imageContainers.forEach((container) => {
//   container.addEventListener('click', () => {
//     const selectedImage = container.querySelector('img');
//     mainImage.src = selectedImage.src;
//     imageTitle.textContent = selectedImage.alt;
//   });
// });

function updateCarousel(index) {
  const selectedImage = imageContainers[index].querySelector('img');
  mainImage.src = selectedImage.src;
  imageTitle.textContent = selectedImage.alt;
}

mainImage.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % imageContainers.length;
  updateCarousel(currentIndex);
});

imageContainers.forEach((container, index) => {
  container.addEventListener('click', () => {
    updateCarousel(index);
  });
});