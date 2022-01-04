"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const shuffledColors = shuffle(COLORS);

createCards(shuffledColors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(shuffledColors) {
  const gameBoard = document.getElementById("game");

  //like the meme container div, we are going to create each card div and append it into the #game div

  for (let color of shuffledColors) {
    const createdCard = document.createElement('div');
    createdCard.classList.add(color); 
    //each element in shuffledColors is already a string so we can just refer to the variable color instead of using a string template literal
    createdCard.addEventListener("click", handleCardClick);
    //if we add the eventListener after we append createdCard, the eventListener won't be appended to the DOM 
    gameBoard.appendChild(createdCard);
  }

//we don't need to return gameBoard because the appended elements show up on the page without returning gameBoard or a page refresh
//because of hoisting, we can call this function above, before it's created. This only works if the func isn't a func expression with an = (basically saving a func to a variable). Otherwise it'll say error: cannot call func before initialization
}

/** Flip a card face-up. */

function flipCard(card) { //imagine card is an HTML element we can use methods on
  console.log(card.classList[0]);
 
  card.style.backgroundColor = card.classList[0];

}

/** Flip a card face-down. */

function unFlipCard(card) {
  // ... you need to write this ...
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  flipCard(evt.target); //it should call the func flipCard, passing in the element we clicked. We should get a console.log of the classes of the clicked element

  //check if the cards are the same color
}

// const button = document.querySelector('button');
// button.addEventListener("click", handleCardClick); //we don't invoke it right away because we are just defining the func here--normally we define an anonymous func here