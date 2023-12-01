// creating blob
const obj = { hello: "worlds" };
const blob = new Blob([JSON.stringify(obj, null, 2)], {
  type: "application/json",
});
console.log(blob);

// clean-up object urls early when you can using URL.revokeObjectUrl()
// (otherwise, they will just be unloaded when the document is unloaded)
const blobUrl = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = blobUrl;
link.innerText = "Open the array URL";

document.body.appendChild(link);

// Can read from a blob in a few ways:
// 1. use a FileReader
const reader = new FileReader();
reader.addEventListener("loadend", () => {
  console.log("FileReader:", reader.result);
});
reader.readAsText(blob);
// 2. wrap in a Response
(async () => {
  console.log("Response:", await new Response(blob).json());
})();
// 3. blob.text()
(async () => {
  console.log(".text():", await blob.text());
})();

// blob response can be set up as an image src using URL.createObjectURL()
fetch("../media/alice.svg")
  .then((response) => response.blob())
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = url;
    document.body.appendChild(img);
  });
