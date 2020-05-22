import {Geo} from "./GeoClass.js";

// Get DOM elements
let formAdd = document.getElementById('formAdd');
let divNotification = document.getElementById('divNotification');

//Import GeoClass class
let geo = new Geo(localStorage.username);


// Add new term
formAdd.addEventListener('submit', e => {
    e.preventDefault();
    let kategorija = document.getElementById('categories').value;
    let pojam = document.getElementById('newTerm').value;
    geo.checkIfExists(kategorija, pojam, data => {
        if(data) {
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
});