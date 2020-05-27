
//DOM ui
const divLetter = document.getElementById('divLetter');
const divTimer = document.getElementById('divTimer');
const buttonStartGame = document.getElementById('buttonStartGame');
//DOM player input
const labelCategory = document.querySelectorAll('label');
const inputPlayer = document.querySelectorAll('.inputPlayer');
//DOM submit answers
const buttonSubmitAnswers = document.getElementById('buttonSubmitAnswers')
//Categories (from Labels)
const labelCategoryArray = [];
labelCategory.forEach(label => labelCategoryArray.push(label.innerText));


import {Game} from "./GameClass.js";
let aiGame = new Game(localStorage.username);
let letter;
buttonStartGame.addEventListener('click', e=>{
    e.preventDefault();
    aiGame.setTimer(3);
    letter = aiGame.randomLetter();
    divLetter.innerText = letter;
    buttonStartGame.setAttribute('disabled',true);
    console.log(letter);
    

})


console.log(labelCategoryArray);

//Array of player answers {category - answer - correct- points}
let playerAnswers = [];
buttonSubmitAnswers.addEventListener('click',e=>{

    e.preventDefault();
    console.log(`The button was pressed, the answers are submitting!`);
    let i = 0;
    inputPlayer.forEach(input =>{
        let kategorija = labelCategoryArray[i];
        playerAnswers.push({'kategorija': kategorija, 'odgovor': input.value, 'tacno':'', 'poeni':0});
        i++;
    })
    aiGame.checkPlayerAnswers(letter,playerAnswers,(isCorrect)=>{
        playerAnswers.forEach(answer=>{
            answer.tacno = isCorrect;
        })
        console.log(playerAnswers)

    })
    buttonSubmitAnswers.setAttribute('disabled',true);

         
})

console.log(playerAnswers)



