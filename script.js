let categories = [];
let videos = [];
let isAscending = false;

const loadCategories = async (id) => {
  const data = await fetchData(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  categories = data.data;
  const catagoryBtnSection = document.getElementById("catagoryBtn-section");
  catagoryBtnSection.innerHTML = "";
  categories.forEach((item) => {
    // console.log(item);
    const div = document.createElement("div");
    div.innerHTML = `<button id="${item.category_id}" onclick="loadCategories(${
      item.category_id
    })" class="category-btn ${
      id == item.category_id
        ? "bg-danger text-light"
        : "bg-body-secondary text-dark"
    }">${item.category}</button>`;
    catagoryBtnSection.appendChild(div);
  });
  loadData(id);
};
const loadData = async (id) => {
  const data = await fetchData(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  videos = data.data;
  videos.length > 0 ? displayVideos(videos) : displayEmpty();
};

const displayVideos = (videos) => {
  const emptyContainer = document.getElementById("empty");
  emptyContainer.innerHTML = "";
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  videos.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("col-md-3");
    div.classList.add("mt-4");
    div.innerHTML = `
  <div class="">
  <figure class="position-relative">
    <img class="img-fluid w-100" src="${item.thumbnail}" alt="#">
    <span class="position-absolute post-time">${
      item.others.posted_date != "" ? timeFormate(item.others.posted_date) : ""
    }</span>
  </figure>
  <div class="detail-section d-flex gap-3">
    <img class="img-fluid author-avatar" src="${
      item.authors[0].profile_picture
    }" alt="#">
    <div class="author-detail">
      <u class="list-unstyled text-decoration-none">
        <li class="h4">
          ${item.title}</li>
          <li>${item.authors[0].profile_name} <span>${
      item.authors[0].verified
        ? '<img class="img-fluid varified-logo" src="./img/varified.svg" alt="">'
        : ""
    }</span></li>
          <li>${item.others.views} views</li>
      </u>
    </div>
  </div>
</div>
  `;
    videoContainer.appendChild(div);
  });
};
const displayEmpty = () => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  const emptyContainer = document.getElementById("empty");
  emptyContainer.innerHTML = `
  <div class="d-flex flex-column justify-content-center align-items-center">
            <img class="img-fluid empty-img" src="./img/Icon.png" alt="">
            <h2 class="mt-5">Oops!! Sorry, There is no content here.</h2>
          </div>
  `;
};
const hadleSort = () => {
  isAscending = !isAscending;
  const sortedData = videos.sort((a, b) => {
    const aVideo = parseInt(a.others.views);
    const bVideo = parseInt(b.others.views);
    return isAscending ? bVideo - aVideo : aVideo - bVideo;
  });
  displayVideos(sortedData);
};
loadCategories("1000");
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

const timeFormate = (seconds) => {
  if (seconds < 60) return `${seconds} seconds ago`;
  else if (seconds < 3600) {
    const minute = Math.floor(seconds / 60);
    return `${minute} minutes ago`;
  } else if (seconds >= 3600 && seconds < 86400) {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    return `${hour} hours ${minute} minutes ago`;
  } else {
    const day = Math.floor(seconds / 86400);
    const hour = Math.floor((seconds % 86400) / 24);
    return `${day} days ${hour} hours ago`;
  }
};
