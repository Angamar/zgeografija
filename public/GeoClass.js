export class Geo {

    constructor(korisnik) {
        this.korisnik = korisnik;
        this.zgeografija = db.collection('zgeografija');
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

    //taking all users
    getUsersAndScore(){
      // [{"name": user, "score": points}]
        this.zgeografija.get()
        .then(snapshot => {
            const names = [];
            snapshot.docs.forEach(doc => {
                let name = doc.data().korisnik;
                names.push(name);
            })    
            return names;
        })
        .then(names => {
            const scoreboard = [];
            names.forEach(name => {
                const playerIndex = scoreboard.findIndex((obj) => obj.name  === name);
                if (playerIndex < 0){
                    scoreboard.push({'name':name, 'score':1})
                } else {
                    scoreboard[playerIndex].score += 1;
                }
            })
            //sorts the scoreboard in descending order
            let sortedScoreboard = scoreboard.sort((a, b) => b.score - a.score);
            console.log(sortedScoreboard);
            return sortedScoreboard;
        })
        .catch(error => console.log(error));
    }


/*       topContributors(){
    let score = {};
    let sorted = [];
        this.zgeografija.get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                let user = doc.data().korisnik;
                    score[user] = (score[user] + 1) || 1; 
            })
            for (let name in score){
            sorted.push([name, score[name]]);
            }
            let topContributors = sorted.sort((a,b) => {
                return b[1] - a[1];
            })
           console.log(topContributors);
           return topContributors;
        }) 
        .catch(error => console.log(error));
    }*/



}