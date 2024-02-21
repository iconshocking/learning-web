function toggleVisiblity(e) {
  e.target.nextElementSibling.classList.toggle("hidden");
}

document
  .querySelector(".collapsable")
  .addEventListener("click", toggleVisiblity);

const uploadEl = document.querySelector("#image_uploads");
const previewEl = document.querySelector(".preview");

const validFileTypes = ["image/bmp", "image/gif", "image/jpeg", "image/png"];

function validFileType(file) {
  return validFileTypes.includes(file.type);
}

uploadEl.addEventListener("change", (e) => {
  previewEl.replaceChildren();
  const files = e.target.files;
  for (const file of files) {
    const previewImg = document.createElement("img");
    previewImg.title = file.name;
    previewImg.style.border = "0.25rem solid green";
    previewImg.style.borderRadius = "0.2rem";
    previewImg.style.display = "block";
    previewImg.style.width = "50%";
    previewImg.style.margin = "1rem 0";
    previewImg.src = URL.createObjectURL(file);
    previewImg.alt = file.name;
    previewEl.appendChild(previewImg);
  }

  if (!previewEl.firstChild) {
    const p = document.createElement("p");
    p.textContent = "No images to display.";
    previewEl.appendChild(p);
  }
});

const price = document.querySelector("#price");
const output = document.querySelector(".price-output");
output.textContent = price.value;
price.addEventListener("input", () => {
  output.textContent = price.value;
});

const color = document.querySelector("#color");
const colorOutput = document.querySelector(".color-output");
colorOutput.textContent = color.value;
color.addEventListener("input", () => {
  colorOutput.textContent = color.value;
});

const progress = document.querySelector("#indeterminate");
// a little extra height to fix a rotation cropping issue
progress.parentElement.style.height = `calc(${progress.clientWidth}px + 1rem)`;
progress.style.transform = "rotate(-90deg) translateX(-50%)";

{
  const frame = document.querySelector("iframe");
  const color = Math.floor(Math.random() * 16777215).toString(16);
  frame.style.backgroundColor = "#" + color;
}
