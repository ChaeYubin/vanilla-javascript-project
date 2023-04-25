let button = document.querySelector(".btn");
let color = document.querySelector(".color");

button.addEventListener("click", () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  document.body.style.backgroundColor = "#" + randomColor;
  color.innerHTML = "#" + randomColor;
});
