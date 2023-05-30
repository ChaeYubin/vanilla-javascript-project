/* 요소 선택 */
const form = document.querySelector(".todo-form");
const alert = document.querySelector(".alert");
const todo = document.getElementById("todo");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clear-btn");

// 수정 옵션
let editElement;
let editFlag = false; // 참이면 수정, 거짓이면 추가 (상태를 확인할 변수)
let editID = "";

// submit form
form.addEventListener("submit", addItem);
// 투두리스트 초기화
clearBtn.addEventListener("click", clearItems);
// DOM 준비가 완료되면 초기화면 세팅
window.addEventListener("DOMContentLoaded", setupItems);

/* 아이템 초기 설정 */
function setupItems() {
  let items = getLocalStorage(); // 로컬 스토리지에서 데이터 가져오기

  if (items.length > 0) {
    // 로컬 스토리지에 데이터가 존재한다면
    items.forEach((item) => {
      createListItem(item.id, item.value); // 투두리스트 아이템 생성
    });

    container.classList.add("show-container"); // container 영역 보여주기
  }
}

function createListItem(id, value) {
  const element = document.createElement("article"); // article 요소 생성
  let attr = document.createAttribute("data-id"); // article 요소에 적용할 속성 생성
  attr.value = id;
  element.setAttributeNode(attr); // 요소와 속성 연결
  element.classList.add("todo-item"); // todo-item 클래스 추가
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <!-- edit btn -->
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <!-- delete btn -->
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>
`;

  // 수정 버튼, 삭제 버튼에 이벤트 리스너 등록
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // 리스트에 요소 추가
  list.appendChild(element);
}

/* 아이템 추가 */
function addItem(e) {
  e.preventDefault(); // submit 시 새로고침 방지

  const value = todo.value; // input에 입력된 값 가져오기
  const id = new Date().getTime().toString(); // 고유 ID 생성

  if (value !== "" && !editFlag) {
    // value에 입력이 들어왔고, editFlag가 false라면
    const element = document.createElement("article"); // article 요소 생성
    let attr = document.createAttribute("data-id"); // article 요소에 적용할 속성 생성
    attr.value = id;
    element.setAttributeNode(attr); // 요소와 속성 연결
    element.classList.add("todo-item"); // todo-item 클래스 추가
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

    // 수정 버튼, 삭제 버튼에 이벤트 리스너 등록
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // 리스트에 요소 추가
    list.appendChild(element);

    // alert 문구 보여주기
    displayAlert("item added to the list", "success");

    // container 보여주기
    container.classList.add("show-container");

    // 로컬 스토리지에 새로운 아이템 추가
    addToLocalStorage(id, value);

    // submit 버튼 클릭 -> 작성창 초기화
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // value에 입력이 들어왔고, editFlag가 true라면 -> 아이템을 수정하려는 경우
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // 로컬 스토리지에 수정 적용
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    // value 값이 입력되지 않았을 때
    displayAlert("투두리스트를 입력해주세요!", "danger");
  }
}

// 로컬 스토리지에 새로운 아이템 추가
function addToLocalStorage(id, value) {
  const todo = { id, value };
  let items = getLocalStorage();
  items.push(todo);
  localStorage.setItem("list", JSON.stringify(items)); // 객체를 직렬화하여 저장
}

// 로컬 스토리지에서 아이템을 가져오는 함수
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list")) // 아이템이 있으면 JSON 형식의 문자열을 객체로 변환하여 반환
    : []; // 아이템이 없으면 빈 배열 반환
}

// 알림 문구 띄우기
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // 1초 뒤 문구창 안보이게 처리
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function setBackToDefault() {
  todo.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// 아이템 수정
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  console.log(element); // element가 무엇인지 확인해보세요!
  editElement = e.currentTarget.parentElement.previousElementSibling;

  todo.value = editElement.innerHTML;
  editFlag = true; // edit 상태임을 저장
  editID = element.dataset.id;

  submitBtn.textContent = "edit";
}

// 로컬 스토리지 아이템 수정
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  // list에서 element를 삭제
  list.removeChild(element);

  // 투두리스트에 아이템이 하나도 없다면 container를 숨기기
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();

  // 로컬 스토리지에서 아이템 삭제(id로 식별)
  removeFromLocalStorage(id);
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    // filter 함수로 삭제하려는 id와 같은 id를 가진 아이템만 제외하고 반환
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// 투두리스트 초기화
function clearItems() {
  const items = document.querySelectorAll(".todo-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
