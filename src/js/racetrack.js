import randomTime from "./service/randomTime";
import raceTpl from "../templates/race.hbs";

const horses = ["Secretariat", "Eclipse", "West Australian", "Flying Fox", "Seabiscuit"];

// const horses = [];

const refs = {
  table: document.querySelector(".js-result-table > tbody"),
  tableCaption: document.querySelector(".js-result-table > caption"),
  startRaceBtn: document.querySelector(".js-start-race-btn"),
  winner: document.querySelector(".js-winner"),
  progress: document.querySelector(".js-progress"),
};

let raceCounter = 0;

refs.startRaceBtn.addEventListener("click", runRace);
refs.winner.textContent = "Waiting new race";

function runRace() {
  if (horses.length === 0) {
    refs.winner.textContent = "No one participant. Waiting for new participants.";
    return;
  }
  refs.startRaceBtn.disabled = true;
  raceCounter += 1;
  refs.table.innerHTML = "";
  refs.winner.textContent = "Racing in process";

  const result = horses.map(horseRaceTime); // array of promises
  fastestHorse(result);
  refs.tableCaption.textContent = `Results of raise № ${raceCounter}`;
  allHorses(result);
}

function fastestHorse(horses) {
  Promise.race(horses).then(fastestHorse => {
    refs.winner.textContent = `The 
    "${fastestHorse.horse}" is win with ${fastestHorse.time} time!`;
  });
}

function allHorses(horses) {
  Promise.all(horses).then(horsesArray => {
    const sortedHorsesByTime = [...horsesArray];
    sortedHorsesByTime.sort((horseA, horseB) => horseA.time - horseB.time);
    sortedHorsesByTime.map((horse, index) => (horse.rank = index + 1));

    const allHorsesFinish = raceTpl(sortedHorsesByTime);

    refs.table.insertAdjacentHTML("beforeend", allHorsesFinish);
    refs.startRaceBtn.disabled = false;
  });
}

function horseRaceTime(horse) {
  return new Promise((resolve, reject) => {
    if (!horse) {
      reject("Horses array is empty");
    }
    const time = randomTime(2000, 3000);
    setTimeout(() => resolve({ horse, time }), time);
  });
}
