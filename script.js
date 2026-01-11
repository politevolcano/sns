// --- Config: Add your images here ---
const galleryData = [
  ["https://files.catbox.moe/b7fjow.jpg"],
  ["https://files.catbox.moe/koi674.jpg"],
  ["https://files.catbox.moe/rd8xpu.jpg","https://files.catbox.moe/8dotq5.jpg"],
  ["https://files.catbox.moe/1fdgxf.jpg"],
  ["https://files.catbox.moe/mlylg9.jpg", "https://files.catbox.moe/3wnulf.jpg"],
  ["https://files.catbox.moe/fxpgeo.jpg", "https://files.catbox.moe/8tq4in.jpg"],
  ["https://files.catbox.moe/wxr394.png", "https://files.catbox.moe/n6janm.jpg"],
  ["https://files.catbox.moe/hksvj8.jpg"],
  ["https://files.catbox.moe/69jvj1.jpg"],
  ["https://files.catbox.moe/r57qhf.jpg","https://files.catbox.moe/ely4dd.jpg"],
];

// --- Grab elements ---
const gallery = document.getElementById("gallery");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const postPrev = document.getElementById("post-prev");
const postNext = document.getElementById("post-next");
const imgPrev = document.getElementById("img-prev");
const imgNext = document.getElementById("img-next");
const counter = document.getElementById("counter");
const imgNav = document.querySelector(".img-nav");
const closeBtn = document.getElementById("close");

let posts = [];
let postIndex = 0;
let imgIndex = 0;
let imgs = [];
let canClick = true;

// --- Wait until everything is loaded ---
window.addEventListener("load", () => {
  generateGallery();
  sortPostsVisual();
  gallery.style.opacity = 1; // fade-in effect
});

// --- Generate posts dynamically ---
function generateGallery() {
  galleryData.forEach((images) => {
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.images = images.join(",");

    const img = document.createElement("img");
    img.src = images[0];
    img.alt = "Artwork";
    img.className = "thumb";
    post.appendChild(img);

    // Multi-image icon
    if (images.length > 1) {
      const icon = document.createElement("span");
      icon.className = "multi-icon";
      icon.textContent = "⧉";
      post.appendChild(icon);
    }

    // Click listener for this post
    img.addEventListener("click", () => {
      // Get the index of this post in the current visual order
      postIndex = posts.indexOf(post);
      openPost();
      lb.style.display = "flex";
    });

    gallery.appendChild(post);
    posts.push(post);
  });

  // Re-sort posts on window resize
  window.addEventListener("resize", sortPostsVisual);
}

// --- Sort posts by visual screen order ---
function sortPostsVisual() {
  posts.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    if (rectA.top !== rectB.top) return rectA.top - rectB.top;
    return rectA.left - rectB.left;
  });
}

// --- Open current post in lightbox ---
function openPost() {
  imgs = posts[postIndex].dataset.images.split(",");
  imgIndex = 0;
  updateImage();
  imgNav.style.display = imgs.length > 1 ? "flex" : "none";
}

// --- Update displayed image ---
function updateImage() {
  lbImg.src = imgs[imgIndex];
  counter.textContent = imgs.length > 1 ? `${imgIndex + 1} / ${imgs.length}` : "";
}

// --- Image navigation ---
function nextImage() {
  if (!canClick || imgs.length <= 1) return;
  canClick = false;
  imgIndex = (imgIndex + 1) % imgs.length;
  updateImage();
  setTimeout(() => canClick = true, 50);
}

function prevImage() {
  if (!canClick || imgs.length <= 1) return;
  canClick = false;
  imgIndex = (imgIndex - 1 + imgs.length) % imgs.length;
  updateImage();
  setTimeout(() => canClick = true, 50);
}

imgNext.addEventListener("click", nextImage);
imgPrev.addEventListener("click", prevImage);

// --- Post navigation ---
function nextPost() {
  if (!canClick) return;
  canClick = false;
  postIndex = (postIndex + 1) % posts.length;
  openPost();
  setTimeout(() => canClick = true, 50);
}

function prevPost() {
  if (!canClick) return;
  canClick = false;
  postIndex = (postIndex - 1 + posts.length) % posts.length;
  openPost();
  setTimeout(() => canClick = true, 50);
}

postNext.addEventListener("click", nextPost);
postPrev.addEventListener("click", prevPost);

// --- Keyboard navigation ---
document.addEventListener("keydown", e => {
  if (lb.style.display !== "flex") return;
  if (imgs.length > 1) {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  }
  if (e.key === "ArrowUp") prevPost();
  if (e.key === "ArrowDown") nextPost();
  if (e.key === "Escape") lb.style.display = "none";
});

// --- Close lightbox ---
closeBtn.addEventListener("click", () => { lb.style.display = "none"; });
lb.addEventListener("click", e => { if (e.target === lb) lb.style.display = "none"; });
