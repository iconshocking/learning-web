export {};

let main = () => {
  const myHeading = document.querySelector("h1");
  if (!myHeading) return;

  const setUserName = () => {
    const myName = prompt("Please enter your name.") ?? "";
    localStorage.setItem("name", myName);
    myHeading.textContent = `Mozilla is cool, ${myName}`;
  };

  if (localStorage.getItem("name")) {
    const storedName = localStorage.getItem("name");
    myHeading.textContent = `Mozilla is cool, ${storedName}`;
  } else {
    setUserName();
  }

  const myImage = document.querySelector("img");
  if (myImage) {
    myImage.onclick = () => {
      const mySrc = myImage.getAttribute("src");
      if (mySrc === "images/mdn_contributor.png") {
        myImage.setAttribute("src", "images/face.jpeg");
      } else {
        myImage.setAttribute("src", "images/mdn_contributor.png");
      }
    };
  }

  let myButton = document.querySelector("button");
  if (!myButton) return;
  myButton.onclick = setUserName;
};

main();
