async function populate() {
  const requestURL =
    "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesJson = await response.json();
  console.log(superHeroesJson);
  // or const superHeroes = JSON.parse(await response.text());

  let myObj = { name: "Chris", age: 38 };
  console.log(JSON.stringify(myObj));
}

populate();
