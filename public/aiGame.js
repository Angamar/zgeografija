
//DOM ui
const divLetter = document.getElementById('divLetter');
const divTimer = document.getElementById('divTimer');
const divWinner = document.getElementById('divWinner');
const buttonStartGame = document.getElementById('buttonStartGame');
//DOM input
const labelCategory = document.querySelectorAll('label');
const inputPlayer = document.querySelectorAll('.inputPlayer');
const inputAi = document.querySelectorAll('.inputAi');
const divPlayerScore = document.querySelectorAll('.divPlayerScore')
const divAiScore = document.querySelectorAll('.divAiScore')
//DOM submit answers
const buttonSubmitAnswers = document.getElementById('buttonSubmitAnswers')
//Categories (from Labels)
const labelCategoryArray = [];
labelCategory.forEach(label => labelCategoryArray.push(label.innerText));


import {Game} from "./GameClass.js";
let aiGame = new Game(localStorage.username);

let letter;
let timer;
buttonStartGame.addEventListener('click', e=>{
    e.preventDefault();
    //stating timer and getting a random letter
    timer = aiGame.setTimer();
    letter = aiGame.randomLetter();
    divLetter.innerText = letter;

    //generating random computer answers for each category


    aiGame.categories.forEach(category=>{
        aiGame.generateAiAnswer(category)
    })
    console.log(aiGame.aiAnswers)


    //enabling and disabling buttons and inputs
    buttonStartGame.setAttribute('disabled',true);
    inputPlayer.forEach((input) =>{input.removeAttribute("disabled")})
    buttonSubmitAnswers.removeAttribute("disabled");
})





//Array of player answers {category - answer - correct- points}

buttonSubmitAnswers.addEventListener('click',e=>{
    buttonSubmitAnswers.setAttribute('disabled',true);  
    aiGame.time = 0;
    e.preventDefault();
    console.log(`The button was pressed, the answers are submitting and checking!`);
    aiGame.getPlayerAnswers(inputPlayer).checkPlayerAnswers()
    inputPlayer.forEach((input) =>{input.setAttribute('disabled',true)})
    inputAi.forEach((input, i)=>{
        input.value = aiGame.aiAnswers[i].odgovor;
    })  
    setTimeout(()=>{
        aiGame.compareAnswers()
        for (let i=0; i<7; i++){
            divPlayerScore[i].innerText = aiGame.playerAnswers[i].poeni;
            divAiScore[i].innerText = aiGame.aiAnswers[i].poeni;
        }
        divWinner.innerText += `${aiGame.declareWinner()}!`;
        divWinner.setAttribute('style','display:block')}
    , 2000)


})

