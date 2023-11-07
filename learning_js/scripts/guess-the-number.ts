const answer = Math.floor(Math.random() * 100) + 1;
let turns = 0;

document.querySelector("button")?.addEventListener("click", () => {
  const guessesList = document.querySelector(".guesses");
  if (!guessesList) return;

  const input = document.querySelector("input[type='text']") as HTMLInputElement;
  if (!input) return;
  const guess = Number((document.querySelector("input[type='text']") as HTMLInputElement).value);
  input.value = "";
  if (!guess && guess !== 0) return;
  guessesList.classList.remove("hidden");

  turns++;
  const li = document.createElement("li");
  li.textContent = guess.toString();
  console.log(guess, answer);
  if (guess > answer) {
    li.textContent = li.textContent += " Too high!";
    li.classList.add("wrong");
  } else if (guess < answer) {
    li.textContent = li.textContent += " Too low!";
    li.classList.add("wrong");
  } else {
    li.textContent = li.textContent += ` Correct! It took you ${turns} turns.`;
    li.classList.add("correct");
  }
  guessesList.appendChild(li);

  if (turns === 10 || li.classList.contains("correct")) {
    document.querySelector("button")?.setAttribute("disabled", "true");
    document.querySelector("input")?.setAttribute("disabled", "true");
  } else {
    input.focus();
  }
});
