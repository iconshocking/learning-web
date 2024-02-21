const width = window.innerWidth;
// window.innerHeight is equivalent to CSS vh (outer height includes browser elements outside the document, address bar, etc.)
const height = window.innerHeight / 2;

{
  const canvas = document.querySelector(".myCanvas");

  // Size canvas via HTML attributes or DOM properties (CSS sizing is done after the canvas has rendered,
  // and the image could become pixelated/distorted (like any image).
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d"); // alternatives are "webgl, "webgl2", etc.

  // later graphics are drawn on top of earlier graphics
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(50, 50, 100, 150);

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(75, 75, 100, 100);

  // alpha channel
  ctx.fillStyle = "rgba(255 0 255 / 75%)";
  ctx.fillRect(25, 100, 175, 50);

  // stroke
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.lineWidth = 5;
  ctx.strokeRect(25, 25, 175, 200);
}

{
  const canvas = document.querySelector(".myCanvas2");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);

  // anything not a rectangle must be done via path
  // triangle
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(150, 50);
  const triHeight = 50 * Math.tan(degToRad(60));
  ctx.lineTo(100, 50 + triHeight);
  ctx.lineTo(50, 50);
  ctx.fill();

  // circle
  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.beginPath();
  // x, y, radius, start angle, end angle, clockwise
  ctx.arc(150, 106, 50, degToRad(0), degToRad(360), false);
  ctx.fill();

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(200, 106, 50, degToRad(-45), degToRad(45), true);
  // .fill() will draw a straight line from the ending point back to the starting point, so ending at the center creates a pacman
  ctx.lineTo(200, 106);
  ctx.fill();

  // text
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  // many text properties are the same as CSS syntax
  ctx.font = "36px arial";
  // text box is strangely defined by its bottom left corner, unlike other bounding box graphics operations
  ctx.strokeText("Canvas text", 50, 50);

  ctx.fillStyle = "red";
  ctx.font = "48px georgia";
  ctx.fillText("Canvas text", 50, 150);

  // canvas text is not added to the DOM, so add an aria-label
  canvas.setAttribute("aria-label", "Canvas text");
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

{
  const canvas = document.querySelector(".myCanvas3");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  // draw image
  const image = new Image();
  image.src = "../media/alice.svg";
  // do not draw image until it is loaded
  // arguments are image, crop start x, crop start y, crop width, crop height,
  // canvas start x, canvas start y, canvas paste width, canvas paste height
  image.addEventListener("load", () =>
    ctx.drawImage(image, 20, 20, 250, 250, 50, 50, 1200, 400),
  );
}

{
  const canvas = document.querySelector(".myCanvas4");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  // move origin to center of canvas
  ctx.translate(width / 2, height / 2);

  let length = 150;
  let moveOffset = 20;
  for (let i = 0; i < length; i++) {
    ctx.fillStyle = `rgb(${255 - length} 0 ${255 - length} / 25%)`;
    ctx.beginPath();
    ctx.moveTo(moveOffset, moveOffset);
    ctx.lineTo(moveOffset + length, moveOffset);
    const triHeight = (length / 2) * Math.tan(degToRad(60));
    ctx.lineTo(moveOffset + length / 2, moveOffset + triHeight);
    ctx.lineTo(moveOffset, moveOffset);
    ctx.fill();

    length--;
    moveOffset += 0.7;
    // rotate entire canvas orientation by 5 degrees
    ctx.rotate(degToRad(5));
  }
}

// Note: a canvas just draws an image, so objects are not manipulatable once drawn.
{
  const canvas = document.querySelector(".myCanvas5");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  ctx.translate(width / 2, height / 2);

  const image = new Image();
  image.src = "../media/graphics.png";
  image.onload = draw;

  let sprite = 0;
  let posX = 0;
  function draw() {
    // clear canvas
    ctx.fillRect(-(width / 2), -(height / 2), width, height);
    ctx.drawImage(image, sprite * 102, 0, 102, 148, 0 + posX, -74, 102, 148);
    // change to next sprite every 13 frames
    if (posX % 13 === 0) {
      if (sprite === 5) {
        sprite = 0;
      } else {
        sprite++;
      }
    }
    // reset sprite position to left if walking off right side of screen
    if (posX > width / 2) {
      let newStartPos = -(width / 2 + 102);
      posX = Math.ceil(newStartPos);
      console.log(posX);
    } else {
      posX += 2;
    }
    window.requestAnimationFrame(draw);
  }
}

{
  const canvas = document.querySelector(".drawCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  let curX, curY;
  let pressed = false;

  // update mouse pointer coordinates
  canvas.addEventListener("mousemove", (e) => {
    curX = e.offsetX;
    curY = e.offsetY;
    console.log(curX, curY);
  });
  canvas.addEventListener("mousedown", () => (pressed = true));
  canvas.addEventListener("mouseup", () => (pressed = false));

  function draw() {
    if (pressed) {
      ctx.fillStyle = "rgb(0 0 0)";
      ctx.beginPath();
      ctx.arc(curX, curY, 20, degToRad(0), degToRad(360), false);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}
