export class Game {

  

    constructor(korisnik) {
        this._korisnik = korisnik;
        this.zgeografija = db.collection('zgeografija');
        this._categories= ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka','Predmet'];
        
    }

    get korisnik() {
        return this._korisnik;
    }

    set korisnik(k){
        this._korisnik = k;
    }
    //change username
    updateUsername(newUsername) {
        this.korisnik = newUsername;
        localStorage.setItem('username', newUsername);
        return newUsername;
    }
    // Get first letter
    firstLetter(string) {
        let check = string.slice(0, 2);
        let letter = ""
        if (check == "Nj" || check == "Lj" || check =="Dž")
            {
                    letter = check;
            } else {
                    letter = string.slice(0, 1);
            }
        return letter;
    }
    // Check input value
    stringCheck(string) {
        let emptyString = /^[/s]$/g;
        let newStr = string
            //delete spaces and tabs
            .replace(/\s+/g, '')
            //delete all special characters and numbers
            .replace(/[^a-đščžć]+/gi, '')
            //only first letter uppercase
            .replace(/(\B)[^ ]*/g, match =>(match.toLowerCase()))
            .replace(/^[^ ]/g, match=>(match.toUpperCase()));
        return newStr;
        }
    // Add new term to firebase
    async newTerm(k, p) {
        let kategorija = k;
        let pojam = this.stringCheck(p);
        let vreme = new Date();

        //creating new document that will be added to firebase
        let newDoc = {
            pocetnoSlovo: this.firstLetter(pojam),
            korisnik: this.korisnik,
            kategorija: kategorija,
            pojam: pojam,
            created_at: firebase.firestore.Timestamp.fromDate(vreme)
        };
        //adding new document to this.geo(it contains whole collection from firebase)
        let response = await this.zgeografija.add(newDoc);
        return response;
    }
    // Check if term already exists 
    checkIfExists(kategorija, p, callback) {
        //term is new
        let isNew = true;
        let pojam = this.stringCheck(p);
        this.zgeografija
            .where('kategorija', '==', kategorija)
            .where('pojam', '==', pojam)
            .get()
            .then( snapshot => {
                snapshot.docs.forEach( doc => {
                    //if found in database, term is not new
                    if(doc.data()) {
                        isNew = false;
                    }
                });
                callback(isNew);
            })
            .catch( error => {
                console.log(error);
            });

    }


    setTimer = seconds => {
        let s = seconds;
        let countdown = ()=> {
            if (s>0){
                divTimer.innerText = `Preostalo vreme: ${s}`; 
                s--;
            }else{
                s='Vreme je isteklo!';
                divTimer.style.color = "red";
                divTimer.innerText = s;
                clearInterval(timer);
            }
        }
        let timer = setInterval(countdown, 1000);

        setTimeout(()=>{buttonSubmitAnswers.click()}, s*1000+1000);
        
    }

    randomLetter = () =>{
        let LettersArray = [ 
            `A`, `B`, `C`, `Č`, `Ć`, `D`, `Dž`, `Đ`, `E`, `F`, 
            `G`, `H`, `I`, `J`, `K`, `L`, `Lj`, `M`, `N`, `Nj`, 
            `O`, `P`, `R`, `S`, `Š`, `T`, `U`, `V`, `Z`, `Ž` ]
        let randomIndex = Math.floor(Math.random() * 30);
        let randomLetter = LettersArray[randomIndex];
        return randomLetter;
    }

    checkPlayerAnswers(randomLetter, playerAnswers, callback){
    // playerAnswers = [{kategorija: Država, odgovor: Gruzija, tacno: true, poeni: 15}]
    let letter = randomLetter;
    let isCorrect = false;
    let checkedAnswers = playerAnswers;
        for ( let answer in checkedAnswers){
            let kategorija = answer.kategorija;
            let pojam = answer.odgovor;
          this.zgeografija
            .where('kategorija', '==', kategorija)
            .where('pojam', '==', pojam)
            .where('pocetnoSlovo', '==', letter)
            .get()
            .then(snapshot =>{
                snapshot.docs.forEach( doc => {
                    //if found in database, term is correct
                    if(doc.data()) {
                        isCorrect = true;
                    };
                callback(isCorrect);
                })
            .catch( error => {
                console.log(error);
            });
            })
        console.log('Random letter is ' + letter);
        console.log(checkedAnswers);
        }


    }

}