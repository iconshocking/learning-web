let array = ["Chris", "Bob", "Mark", "Paul"];

array.forEach((e, i) => {
  const elem = document.createElement("p");
  elem.textContent = i + 1 + ". " + e;
  document.body.appendChild(elem);
});
const button = document.createElement("button");
button.addEventListener("click", () => {
  document.title = "I been clicked!";
});
button.textContent = "Click me!";
document.body.appendChild(button);

export default () => 3.141593;
