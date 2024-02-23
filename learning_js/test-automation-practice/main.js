let array = ["Chris", "Bob", "Mark", "Paul"];

array.forEach((e, i) => {
  const elem = document.createElement("p");
  elem.textContent = i + 1 + ". " + e;
  document.body.appendChild(elem);
});

export default () => 3.141593;