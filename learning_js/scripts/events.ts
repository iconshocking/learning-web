const btn = document.querySelector("button");

function random(number: number) {
  return Math.floor(Math.random() * number);
}

function randomBackground() {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
}

const abortController = new AbortController();

btn?.addEventListener("click", randomBackground, {
  signal: abortController.signal,
});
btn?.addEventListener(
  "click",
  () => {
    const button = document.createElement("button");
    button.style.display = "block";
    button.textContent = "CLICKY CLACK";
    document.body.appendChild(button);
  },
  {
    signal: abortController.signal,
  },
);

btn?.addEventListener(
  "mouseover",
  () => {
    const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    btn.style.backgroundColor = rndCol;
  },
  { signal: abortController.signal },
);
btn?.addEventListener(
  "mouseout",
  () => {
    btn.style.backgroundColor = "revert";
  },
  { signal: abortController.signal },
);

const removeBtn = document.querySelector(".remove") as HTMLButtonElement;
removeBtn?.addEventListener("click", () => {
  btn?.removeEventListener("click", randomBackground);
});

const abortBtn = document.querySelector(".abort") as HTMLButtonElement;
abortBtn?.addEventListener("click", () => {
  abortController.abort("You clicked the abort button!");
});

// function2 replaces function1, so don't set listeners via event handler properties
// element.onclick = function1;
// element.onclick = function2;

function bgChange() {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  return rndCol;
}

const container = document.querySelector("#container");

// event.currentTarget applies to element listener is attached to;
// event.target applies to element that triggered the event
container?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement) {
    event.target.style.backgroundColor = bgChange();
  }
});

class Something {
  name = "Something Good";
  constructor(element: HTMLElement) {
    // bind causes a fixed `this` context to be assigned;
    // without bind, `this` would be the element that was clicked
    this.onclick = this.onclick.bind(this);
    element.addEventListener("click", this.onclick, false);
    element.addEventListener("click", this, false);
  }
  onclick(event: Event) {
    console.log(this.name); // 'Something Good', as `this` is bound to the Something instance
  }
  // can also use `handleEvent()` which retains its `this` context
  handleEvent(event: Event) {
    console.log(this.name); // 'Something Good', as this is bound to newly created object
  }
  // or use an arrow function since they do not create their own `this` binding
  register(element: HTMLElement) {
    element.addEventListener("click", (e) => {
      this.someMethod(e);
    });
  }
  someMethod(e: Event) {
    console.log(this.name);
  }
}

const extra = document.querySelector(".extra") as HTMLDivElement | null;

let passiveSupported = false;
try {
  const options: AddEventListenerOptions = {
    get passive() {
      // This function will be called when the browser
      // attempts to access the passive property.
      passiveSupported = true;
      return false;
    },
  };

  window.addEventListener("test" as any, () => {}, options);
  window.removeEventListener("test" as any, () => {}, {
    capture: options.capture,
  });
} catch (err) {
  passiveSupported = false;
}
extra?.addEventListener(
  "mouseup",
  () => console.log(`Passive supported: ${passiveSupported}`),
  passiveSupported ? { passive: true } : false,
);

// Getting data into an event listener using "this"
const someString = "Data";
extra?.addEventListener(
  "click",
  function (this: string) {
    // Expected Value: 'Data'
    console.log("this =", this);
  }.bind(someString),
);
// Using an outer scope variable captured by a closure or an object works as well

// Improving scroll performance using passive listeners (won't call preventDefault())
const passive = document.querySelector("#passive") as HTMLInputElement;
passive.addEventListener("change", () => {
  document.removeEventListener("wheel", wheelHandler);
  document.addEventListener("wheel", wheelHandler, {
    passive: passive.checked,
    once: true,
  });
  console.log("passive =", passive.checked);
});

document.addEventListener("wheel", wheelHandler, {
  passive: true,
  once: true,
});

function wheelHandler() {
  console.log("start");
  for (let i = 0; i < 1000000000; i++) {
    // do nothing
  }
  console.log("done");
}
