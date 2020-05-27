import {Geo} from "./GeoClass.js";

// Get DOM elements
const formUsername = document.getElementById('formUsername');
const divNotification = document.getElementById('divNotification');
const divHof = document.getElementById('divHof');

//Import GeoClass class

let geo = new Geo(localStorage.username);

//Change username
formUsername.addEventListener('submit', e => {
    e.preventDefault();
    let usernameCheck = formUsername.username.value;
    
    //validation
    let check = /^[\w]{3,12}$/g;
    if (check.test(usernameCheck)){
        let username = geo.updateUsername(usernameCheck);
        formUsername.reset();
        divNotification.style.color = 'green';
        divNotification.innerText = `Vaše novo korisničko ime je ${username}`;
        setTimeout(() => divNotification.innerText = '', 2000);
        console.log(`Your new username is ${username}`);
    } else {
        formUsername.reset();
        divNotification.style.color = 'red';
        divNotification.innerText = `Korisničko ime sme sadržati brojeve, slova i donju crtu, i biti dugo između 3 i 12 karaktera!`;
        setTimeout(() => divNotification.innerText = '', 5000);
        console.log(`Username change failed`);

    }
});




