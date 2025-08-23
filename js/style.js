// const imageContainers = document.querySelectorAll('.carousel-images .image');
// const mainImage = document.querySelector('.main-image');
// const imageTitle = document.querySelector('.image-title');
// let currentIndex = 0;

// function updateCarousel(index) {
//   const selectedImage = imageContainers[index].querySelector('img');
//   mainImage.src = selectedImage.src;
//   imageTitle.textContent = selectedImage.alt;
// }

// mainImage.addEventListener('click', () => {
//   currentIndex = (currentIndex + 1) % imageContainers.length;
//   updateCarousel(currentIndex);
// });

// imageContainers.forEach((container, index) => {
//   container.addEventListener('click', () => {
//     updateCarousel(index);
//   });
// });


document.addEventListener('DOMContentLoaded', () => {
  const imageContainers = document.querySelectorAll('.carousel-images .image');
  const mainImage = document.querySelector('.main-image');
  const imageTitle = document.querySelector('.image-title');
  let currentIndex = 0;

  function updateCarousel(index) {
    const selectedImage = imageContainers[index].querySelector('img');
    mainImage.src = selectedImage.src;
    imageTitle.textContent = selectedImage.alt;
  }

  if (mainImage) {
    mainImage.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imageContainers.length;
      updateCarousel(currentIndex);
    });
  }

  imageContainers.forEach((container, index) => {
    container.addEventListener('click', () => {
      updateCarousel(index);
      currentIndex = index;
    });
  });

  // Initialize with first image
  if (imageContainers.length > 0) updateCarousel(0);
});

function toggleOverlay(container) {
    container.classList.toggle("active");
  }

function openImagextract() {
  window.open("https://github.com/kariemoorman/imagextract", "_blank");
}

function openTiktokAnalyzer() {
  window.open("https://github.com/kariemoorman/tiktok-analyzer", "_blank");
}

function openIPLocator() {
  window.open("https://github.com/kariemoorman/IPLocator", "_blank");
}

function openRedditRecon() {
  window.open("https://github.com/kariemoorman/reddit-recon", "_blank");
}

function openDIY() {
  window.open("https://github.com/kariemoorman/didactic-diy", "_blank");
}

function openOCRAWS() {
  window.open("https://github.com/kariemoorman/agentive-ocr-aws", "_blank");
}


document.addEventListener("DOMContentLoaded", function () {
  const blogElements = [
    { id: "imagextract", handler: openImagextract },
    { id: "tiktok-analyzer", handler: openTiktokAnalyzer },
    { id: "ip-locator", handler: openIPLocator },
    { id: "reddit-recon", handler: openRedditRecon },
    { id: "didactic-diy", handler: openDIY },
    { id: "ocr-aws", handler: openOCRAWS },
  ];

  blogElements.forEach(({ id, handler }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", handler);
    }
  });
});



function launchPlane() {
  const plane = document.createElement("div");
  plane.classList.add("plane");
  plane.textContent = "🛸";

  const top = Math.random() * 85 + 5;
  plane.style.top = `${top}vh`;
  plane.style.fontSize = `${Math.random() * 1.5 + .3}rem`;
  const speed = Math.random() * 2 + 1.5;
  plane.style.animationDuration = `${speed}s`;
  const flyLeft = Math.random() < 0.5;
  const isZigzag = Math.random() < 0.5;

  if (flyLeft) {
    plane.style.right = '-60px';
    plane.style.left = 'auto';
    plane.style.animationName = isZigzag ? 'fly-zigzag-left' : 'fly-angled-left';
  } else {
    plane.style.left = '-60px';
    plane.style.right = 'auto';
    plane.style.animationName = isZigzag ? 'fly-zigzag-right' : 'fly-angled-right';
  }

  document.getElementById("sky").appendChild(plane);

  plane.addEventListener("animationend", () => {
    plane.remove();
  });
}

function startRandomFlights() {
  setInterval(() => {
    if (Math.random() < 0.6) { 
      launchPlane();
    }
  }, Math.random() * 9000 + 3000);
}

window.onload = startRandomFlights;
