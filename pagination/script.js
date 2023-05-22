const title = document.querySelector(".section-title h1");
const container = document.querySelector(".container");
const btnContainer = document.querySelector(".btn-container");

let index = 0;
let pages = [];

// 1. 데이터 가져오기
const url = "https://api.github.com/users/john-smilga/followers?per_page=100";

const fetchFollowers = async () => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const init = async () => {
  const followers = await fetchFollowers();
  title.textContent = "Pagination";

  pages = paginate(followers);
  setupUI();
};

const setupUI = () => {
  displayFollowers(pages[index]);
  displayButtons(btnContainer, pages, index);
};

// 2. 데이터 보여주기
const displayFollowers = (followers) => {
  let newFollowers = followers.map((person) => {
    const { avatar_url, login, html_url } = person;

    return `
        <article class="card">
            <img src="${avatar_url}", alt='person'/>
            <h4>${login}</h4>
            <a href="${html_url}" class="btn">view profile</a>
        </article>`;
  });

  newFollowers = newFollowers.join("");
  container.innerHTML = newFollowers;
};

// 3. 버튼 만들기
const displayButtons = (container, pages, activeIndex) => {
  let btns = pages.map((_, pageIndex) => {
    return `<button class="page-btn ${
      activeIndex === pageIndex ? "active-btn" : ""
    }" data-index="${pageIndex}">
    ${pageIndex + 1}</button>`;
  });
  btns.push(`<button class="next-btn">next</button>`);
  btns.unshift(`<button class="prev-btn">prev</button>`);
  container.innerHTML = btns.join("");
};

// 4. 페이지네이션
const paginate = (followers) => {
  const itemsPerPage = 10;
  const numberOfPages = Math.ceil(followers.length / itemsPerPage);

  const newFollowers = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return followers.slice(start, start + itemsPerPage);
  });

  return newFollowers;
};

// 버튼에 이벤트 달기
btnContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-container")) return;
  if (e.target.classList.contains("page-btn")) {
    index = parseInt(e.target.dataset.index);
  }

  if (e.target.classList.contains("next-btn")) {
    index++;
    if (index > pages.length - 1) {
      index = 0;
    }
  }

  if (e.target.classList.contains("prev-btn")) {
    index--;
    if (index < 0) {
      index = pages.length - 1;
    }
  }
  setupUI();
});

init();
