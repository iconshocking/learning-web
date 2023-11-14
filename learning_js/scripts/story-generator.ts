const customNameEl = document.getElementById("customname") as HTMLInputElement;
const randomizeEl = document.querySelector(".randomize") as HTMLButtonElement;
const storyEl = document.querySelector(".story") as HTMLParagraphElement;

const story =
  "It was :insert-temp: outside, so :insert-name: went for a walk. \
When they got to :insert-location:, they stared in horror for a few moments, then :insert-action:. \
:insert-custom-name: saw the whole thing, but was not surprised — :insert-name: weighs :insert-weight:, and it was a hot day.";

const names = ["Willy the Goblin", "Big Daddy", "Father Christmas"] as const;

const places = ["the soup kitchen", "Disneyland", "the White House"] as const;

const actions = [
  "spontaneously combusted",
  "melted into a puddle on the sidewalk",
  "turned into a slug and crawled away",
] as const;

function getRandomElementFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStory() {
  const isUS = (document.getElementById("us") as HTMLInputElement).checked;
  let temp = 94,
    weight = 300;
  let tempType = "fahrenheit",
    weightType = "pounds";
  if (!isUS) {
    temp = Math.round((temp - 32) / (9 / 5));
    weight = Math.round(weight / 2.2);
    tempType = "celsius";
    weightType = "kilograms";
  }

  storyEl.textContent = story
    .replace(/:insert-name:/g, getRandomElementFromArray(names))
    .replace(/:insert-location:/g, getRandomElementFromArray(places))
    .replace(/:insert-action:/g, getRandomElementFromArray(actions))
    .replace(/:insert-temp:/g, temp.toString() + " " + tempType)
    .replace(/:insert-weight:/g, weight.toString() + " " + weightType)
    .replace(/:insert-custom-name:/g, customNameEl.value || "Bob");

  storyEl.style.visibility = "visible";
}

randomizeEl.addEventListener("click", generateStory);
