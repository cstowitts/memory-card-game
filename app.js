"use strict";

//GLOBAL VARIABLES

const gameBoard = document.getElementById("cards-container-div");

const cardsDeck = [
    { name: "antonio", src: "./random-assets/antonio-banderas.gif" },
    { name: "future", src: "./random-assets/squidward-future.gif" },
    { name: "arthur", src: "./random-assets/arthur-fist.gif" },
    { name: "flower", src: "./random-assets/you-did-it-flower.gif" },
    { name: "shaq", src: "./random-assets/shaq-shimmy.gif" },
    { name: "angry", src: "./random-assets/angry-david-schitts-creek.gif" },
    { name: "googly", src: "./random-assets/sarah-paulson-googly-face.gif" },
    { name: "antonio", src: "./random-assets/antonio-banderas.gif" },
    { name: "arthur", src: "./random-assets/arthur-fist.gif" },
    { name: "flower", src: "./random-assets/you-did-it-flower.gif" },
    { name: "shaq", src: "./random-assets/shaq-shimmy.gif" },
    { name: "angry", src: "./random-assets/angry-david-schitts-creek.gif" },
    { name: "kimchi", src: "./random-assets/kimchi-slap.gif" },
    { name: "googly", src: "./random-assets/sarah-paulson-googly-face.gif" },
    { name: "future", src: "./random-assets/squidward-future.gif" },
    { name: "kimchi", src: "./random-assets/kimchi-slap.gif" }
];

let shuffledCards = shuffle(cardsDeck);

const cards = document.querySelectorAll(".card");

const cardBackDesign = "./random-assets/mem-card-back-design.png";

let clicksCounterEl = document.querySelector(".current-clicks");
let clickCounter = 0;

let gameWinsCounterEl = document.querySelector(".games-won");
let gameWinsCounter = 0;

const clickedCardsNames = [];
const clickedCardsIds = [];

let matchesMade = 0;
const gamesWon = [];

const resetButton = document.querySelector(".reset-btn");

const congratsDiv = document.querySelector(".congrats-container");
const closeCongratsBtn = document.querySelector(".close-congrats-screen-btn");

//this variable refers to the screen size based on whether the size of the user's screen on load falls within the parameters of the media query in our CSS stylesheet
let isMobile = window.matchMedia("(max-width: 480px)").matches;

//this variable determines whether the type of event for all our addEventListeners is going to be click or dblclick depending on whether they are on a mobile screen or not
let eventType = isMobile ? "dblclick" : "click";


// HELPER FUNCTIONS

//this func shuffles array items (card objs) in-place and returns the shuffled array using the Fisher-Yates shuffle algorithm
function shuffle(items) {

    for (let i = items.length - 1; i > 0; i--) {
        // generate a random index between 0 and i
        let j = Math.floor(Math.random() * i);
        // swap item at i <-> item at j
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
}

//this func creates a card for every name in the colors array (each name appears twice as a pair). each div DOM element has a class corresponding to its name and a click listener for each card to handleCardClick
function createCards(shuffledCards) {
    //like the meme container div, we are going to create each card img and append it into the #game div

    for (let i = 0; i < shuffledCards.length; i++) {

        //create card container div (to hold the cardImg and add a class
        const cardContentDiv = document.createElement('div');
        cardContentDiv.classList.add("card-content-div");
        // console.log("I made the cardContentDiv!", i);

        //create the card img element (starts with card back src)
        const cardImg = document.createElement('img');
        //give each card a class for ease of CSS
        cardImg.classList.add("card");
        //set cardImg src to the card back src (flip will be controlled by css display: hidden +toggle)
        cardImg.setAttribute("src", cardBackDesign);
        // console.log("I made the cardImg! And set its src to the card back design!", i);
        //add a data-idx attribute on each card that is specific to that card's index in the shuffledCards array 
        cardImg.setAttribute("data-idx", i);

        //add event listener that will trigger flipCard func on click TO THE IMG to prevent bubbling
        cardImg.addEventListener(eventType, handleCardClick);

        //append cardImg to cardContentDiv
        cardContentDiv.append(cardImg);
    
        //append created card (cardContentDiv) to cards container div (gameBoard) on DOM 
        gameBoard.append(cardContentDiv);

        //we don't need to return gameBoard because the appended elements show up on the page without returning gameBoard or a page refresh
    }

}

//handle clicking on a card: could be 1st or 2nd card
function handleCardClick(event) {

    // console.log("event target :", event.target);
    // console.log("event current target :", event.currentTarget);
    // console.log("event target = current target?:", event.target === event.currentTarget);

    //we don't want the user to be able to click more than 2 cards at a time. only fire if there are 0 or 1 cards clicked, if two cards are clicked, the clickedCardsIds array length will be 2. We also need to check that the idx of the clicked card isn't already in clickedCardsIds--we don't want multiclicks to work!
    if (clickedCardsIds.length < 2 && !clickedCardsIds.includes(event.target.dataset.idx) && !event.target.classList.contains("matched")) {
        flipCard(event.target);
    };
}

//because of hoisting, we can call this function above, before it's created. This only works if the func isn't a func expression with an = (basically saving a func to a variable). Otherwise it'll say error: cannot call func before initialization

//this func flips a clicked card face-up (toggles cardBackImg overlay to display: hidden) we are first going to swap the img src from the cardBack src to the gif img src 
function flipCard(card) {

    //track the click, increment clickCounter 
    clickCounter++;

    //and update clicksCounterEl's inner text with the new click count
    clicksCounterEl.innerText = clickCounter;

    //save this clicked card's id/idx to the variable 'selected'
    let selected = card.dataset.idx;

    //save the clicked card's src to the variable 'cardImgSrc'
    let cardImgSrc = shuffledCards[selected].src;

    //save the clicked card's name to the variable 'cardName'
    let cardName = shuffledCards[selected].name;

    //change the card img by switching its src with the correct src associated with its position in the shuffledCards array
    card.setAttribute("src", cardImgSrc);

    //push the clicked card's name property value into the clickedCardsImgs array
    clickedCardsNames.push(cardName);
    console.log("card names: ", clickedCardsNames);

    //push clicked card's id (saved in 'selected') into the clickedCardsIds array
    clickedCardsIds.push(selected);
    console.log("card ids: ", clickedCardsIds);

    //once 2 cards are clicked (aka there's 2 ids in the clickedCardsIds array), fire the doTheyMatch fun to check for a match after waiting .5 secs
    if (clickedCardsIds.length === 2) {
        // check if they match areMatching = true/false (based on do they match func)
        //if true, setTimeout checkForWin, if false, setTimeout unFlipCard (cards have to stay face up for 1 sec)
        setTimeout(doTheyMatch, 250);
    }

}

//this func checks if the two cards are matching gifs
//this func name sounds like it should return a boolean, in the future have it return a boolean and wherever this is called can work with that boolean value. It would be better if it didn't expressly do anything with the boolean within this func--that can be the job of whatever funcs call it. It'll make it a more flexible and reusable func that way.
function doTheyMatch() {
    let firstCard = getSelectedCardsEls()[0];
    let secondCard = getSelectedCardsEls()[1];
    let firstCardName = clickedCardsNames[0];
    let secondCardName = clickedCardsNames[1];

    //if the names in the clickedCardsNames array match AND they DON'T have the same idx (aka the user didn't click the same card twice), the cards are a match
    if (firstCardName === secondCardName && firstCard.dataset.idx !== secondCard.dataset.idx) {
        //increment matchesMade
        matchesMade += 1;

        //add the matched class to prevent the matched cards from being clicked on again once they've matched
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        //check to see if the user has won
        checkForWin();

        //reset the clickedCardsIds and clickedCardsNames arrays for the next match
        clickedCardsNames.length = 0;
        clickedCardsIds.length = 0;

    } else {
        // and if they aren't a match, unflip them
       
        //let the unmatching cards show for 1 sec and then flip them face-down
        setTimeout(function() {
            unFlipCard();
            //originally needed the ids of the two flipped cards as arguments
            //doesn't need arguments of the cards' ids anymore bc they're in the global scope in the array clickedCardsIds

        }, 1000); //wait one second before calling unFlipCard

        //just like in an addEventListener--we need to pass in a func DECLARATION, you can't call the upFlipCard func with arguments or else it'll execute immediately before the delay finishes. If you do have a func you DO have to invoke, wrap it in an anonymous func so it doesn't execute right away
    }

}

//BE CAREFUL!! the setTimeout wouldn't work because we accidentally named the function below "unflipCard" instead of "unFlipCard"<<<CAMELCASING, DO YOU KNOW IT??
function unFlipCard() {

    //select the elements of the clicked cards using the getSelectedCardsEls() 
    let firstCard = getSelectedCardsEls()[0];
    let secondCard = getSelectedCardsEls()[1];

    //and replace the img src attributes for both cards to the card back design
    firstCard.setAttribute("src", cardBackDesign);
    secondCard.setAttribute("src", cardBackDesign);

    //reset the clickedCardsIds and clickedCardsNames arrays for the next match
    clickedCardsNames.length = 0;
    clickedCardsIds.length = 0;
}


function checkForWin() {
    //if the number of matched pairs is = to the length of the card deck divided by 2, user has won
    if(matchesMade === shuffledCards.length / 2){
        //toggle the display:none property on the congrats screen and button for the winner
        congratsDiv.style.display = "block";

        //reset matchesMade variable for the new game
        matchesMade = 0;

        //increment the won games counter
        gameWinsCounter += 1;
        //update the table to reflect new score
        gameWinsCounterEl.innerText = gameWinsCounter;

       
    }
}

function startNewGame() {
    //empty the gameBoard (.cards-container-div)
    gameBoard.innerText = "";

    //reset the clicksCounter variable and update the clicks counter on page
    clickCounter = 0;
    clicksCounterEl.innerText = clickCounter;

    //reshuffle the cards (can't just call shuffledCards again because it won't change the order of the cards)
    let shuffledCards = shuffle(cardsDeck);
    //repopulate the gameBoard with the newly reshuffled cardsDeck
    createCards(shuffledCards);
}

//this func makes the congrats screen and button disappear (using display: none) when the button on the congrats screen is clicked
function hideCongrats(){
    // closeCongratsBtn.style.display = "none";
    congratsDiv.style.display = "none";

}

//this func taps into clickedCardsIds, uses the data-idx of each card to querySelect each element/card and returns an array of the actual elements. We don't wanna have to keep using document.querySelector(`[data-idx = '${firstCardId}']`)
function getSelectedCardsEls () {
    //tap into the clickedCardsIds to get the unique ids of the first card and the second card
    let firstCardId = clickedCardsIds[0];
    let secondCardId = clickedCardsIds[1];

    //using the ids of the clicked cards, select those card elements through the data-idx attribute 
    let firstCard = document.querySelector(`[data-idx = '${firstCardId}']`);
    let secondCard = document.querySelector(`[data-idx = '${secondCardId}']`);

    return [firstCard, secondCard];
}

//EVENT LISTENERS

//when the reset button is clicked, call startNewGame func
resetButton.addEventListener(eventType, startNewGame);

//adds an event listener on the button on the congrats screen to close it
closeCongratsBtn.addEventListener("click", hideCongrats);






//initializes game, starts everything on load
createCards(shuffledCards);



//consider changing the absolutely positioned div congrats screen to a modal in a container div that grays out the stuff behind the popup/modal