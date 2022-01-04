"use strict";

//GLOBAL VARIABLES

const gameBoard = document.getElementById("cards-container-div");
const colors = [ //change these to have a src property set to their gifs (download gifs into asset folder and don't forget ./ for GitHub)
    { color: "red", src: "./mem-card-assets/antonio-banderas.gif" },
    { color: "blue" },
    { color: "green" },
    { color: "orange" },
    { color: "purple" },
    { color: "red", src: "./mem-card-assets/antonio-banderas.gif" },
    { color: "blue" },
    { color: "green" },
    { color: "orange" },
    { color: "purple" }
];

const shuffledColors = shuffle(colors);


const cards = document.querySelectorAll(".card");

const clickedCardsColors = [];
const clickedCardsIds = [];

// HELPER FUNCTIONS

//this func shuffles array items (colors) in-place and returns the shuffled array using the Fisher-Yates shuffle algorithm
function shuffle(items) {

    for (let i = items.length - 1; i > 0; i--) {
        // generate a random index between 0 and i
        let j = Math.floor(Math.random() * i);
        // swap item at i <-> item at j
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
}

//this func creates a card for every color in the colors array (each color appears twice as a pair). each div DOM element has a class corresponding to its color and a click listener for each card to handleCardClick
function createCards(shuffledColors) {
    //like the meme container div, we are going to create each card div and append it into the #game div

    for (let i = 0; i < shuffledColors.length; i++) {
        let cardObj = shuffledColors[i];

        //create the card img element to put inside card div
        const cardFrontImg = document.createElement('img');
       
        cardFrontImg.setAttribute("data-idx", i)
        //this adds a data-idx attribute on each card that is specific to that card's index in the shuffledColors array 
        //set the initial img src of each card to be the card-back (instead of changing the background-color of the card, we are changing the img src of the card)
        cardFrontImg.setAttribute("src", cardObj.src) 

        //create the card div and stick the card img into it
        const createdCard = document.createElement("div");
        createdCard.append(cardFrontImg);
    
       
        createdCard.classList.add("card", cardObj.color);
        //each element in shuffledColors is already a string so we can just refer to the variable color instead of using a string template literal
        
        createdCard.addEventListener("click", handleCardClick);
        //if we add the eventListener after we append createdCard, the eventListener won't be appended to the DOM 
        gameBoard.append(createdCard);

    }

    //we don't need to return gameBoard because the appended elements show up on the page without returning gameBoard or a page refresh
    //because of hoisting, we can call this function above, before it's created. This only works if the func isn't a func expression with an = (basically saving a func to a variable). Otherwise it'll say error: cannot call func before initialization
}

//this function flips a clicked card face-up
function flipCard(card) {
    card.classList.toggle("clicked");

    //save the this/clicked card's id/idx to the variable 'selected'
    let selected = card.dataset.idx;
    // console.log(selected);

    //changes background color based on color class of div
    card.style.backgroundColor = card.classList[1];

    //use the clicked card's id/idx to push its color property value into the clickedCards array
    clickedCardsColors.push((shuffledColors[selected]).color);

    //push clicked card's id/idx into clickedCardsIds array
    clickedCardsIds.push(selected);
    // console.log(clickedCardsIds);

    //once 2 cards are clicked (aka there's 2 ids in the clickedCardsIds array), fire the doTheyMatch func to check for a match after waiting 1/2 sec
    if (clickedCardsIds.length === 2) {
        {
            setTimeout(doTheyMatch, 500);
        }
    }

}


//this func checks if the two cards are matching colors
function doTheyMatch() {
    let firstCardId = clickedCardsIds[0];
    let secondCardId = clickedCardsIds[1];
    let firstCardColor = clickedCardsColors[0];
    let secondCardColor = clickedCardsColors[1];

    //if the colors in the clickedCards array match AND they don't have the same id/idx, the cards are a match
    if (firstCardColor === secondCardColor && firstCardId !== secondCardId) {
        //should I remove the clicked attribute and replaced it with a matched class?
        alert("you found a match!");
        //reset the clicked card id and color arrays
        clickedCardsIds.length = 0;
        clickedCardsColors.length = 0;


    } else { //and if they aren't a match, unflip them
       //let the unmatching cards show for 1 sec and then flip them face-down
       //just like in an addEventListener--we need to pass in a func DECLARATION, you can't call the upFlipCard func with arguments or else it'll execute immediately before the delay finishes. If you do have a func you DO have to invoke, wrap it in an anonymous func so it doesn't execute right away
       setTimeout(function (){
            unFlipCard(firstCardId, secondCardId);
            //bc these don't scope to the unFlipCard func, we pass them in as arguments and replace them with cardOneId and cardTwoId
       }, 3000);
    }   
};


//this func flips an unmatching card face-down
function unFlipCard(cardOneId, cardTwoId) {
    //if two cards are flipped but their color class doesn't match, setTimeout to unflip them after 1 second, toggle backgroundColor
    // card.classList.toggle("unclicked");

    //remove the background color of clicked cards
    let firstCard = document.querySelector(`[data-idx = '${cardOneId}']`);
    console.log(firstCard);
    let secondCard = document.querySelector(`[data-idx = '${cardTwoId}']`);
    console.log(secondCard);

    firstCard.style.backgroundColor = "transparent";
    secondCard.style.backgroundColor = "transparent";

    //reset the clicked card id and color arrays
    clickedCardsIds.length = [];
    clickedCardsColors.length = [];

    // console.log(`clickedCardsId array: ${clickedCardsIds}`);
    // console.log(`clickedCardsColors array: ${clickedCardsColors}`);
}

// EVENT LISTENERS

//handle-clicking on a card: could be first card or second card


function handleCardClick(event) {
    //we don't want the user to be able to click more than 2 cards at a time. only fire if there are 0 or 1 cards clicked, if two cards are clicked, the clickedCardsIds array length will be 2
    if(clickedCardsIds.length < 2){
        flipCard(event.target);
    };
}


//initializes game, starts everything on load
createCards(shuffledColors); 



//Cella's sexy extras corner!!!!!
//game start button
    //you don't see cards automatically, you first see a button that says "play"
    //then eventListener for button, once clicked, then createCards gets called
//game reset button  ++COMPLETED++
//track number of games won, and number of clicks ++COMPLETED++
//toggle difficulty, more cards or less cards (2-30)
//congrats screen/effects on win
//change card gif theme



