let button = document.querySelector(".btn");
let color = document.querySelector(".color");

let colors = ["red", "green", "blue", "darksalmon", "deeppink", "azure"];

button.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * (colors.length - 1));
  document.body.style.backgroundColor = colors[randomIndex];
  color.innerHTML = colors[randomIndex];
});
