import {Geo} from "./GeoClass.js";

// Get DOM elements
let formUsername = document.getElementById('formUsername');
let inputUsername = document.getElementById('inputUsername');

//Import GeoClass class

let geo = new Geo(localStorage.username);

//Change username
formUsername.addEventListener('submit', e => {
    e.preventDefault();
    let username = geo.updateUsername(inputUsername.value);
    console.log(`Your new username is ${username}`);
});

