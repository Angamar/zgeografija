import {Geo} from "./GeoClass.js";

// Get DOM elements
const formAdd = document.getElementById('formAdd');
const divNotification = document.getElementById('divNotification');
const divHof = document.getElementById('divHof');

//Import GeoClass class
let geo = new Geo(localStorage.username);


// Add new term
formAdd.addEventListener('submit', e => {
    e.preventDefault();
    let kategorija = document.getElementById('categories').value;
    let pojam = document.getElementById('newTerm').value;
    //Prevents submit without username (with notification)
    if(!localStorage.username) {
        formAdd.reset();
        divNotification.style.color = 'red';
        divNotification.textContent =  'Ne možete unositi pojmove bez korisničkog imena!';
    } else {
        //prevents submitting empty input (with notification)
        let pattern = /^(?!\s*$).+/;
        if (!pattern.test(pojam) | pojam == "" | pojam == null){
            formAdd.reset();
            divNotification.style.color = 'red';
            divNotification.innerText = 'Unesite neki pojam!'
            setTimeout(() => divNotification.innerText = '', 2000);
        } else {
            geo.checkIfExists(kategorija, pojam, isNew => {
                if(isNew) {
                    geo.newTerm(kategorija, pojam);
                    formAdd.reset();
                    divNotification.innerText = 'Pojam uspešno dodat!'
                    setTimeout(() => divNotification.innerText = '', 2000);
                } else {
                    formAdd.reset();
                    divNotification.innerText = 'Pojam već postoji u bazi!'
                    setTimeout(() => divNotification.innerText = '', 2000);
        
                }
            });
        }
    }      
});
