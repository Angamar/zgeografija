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
            let x = true;
            let pojam = this.stringCheck(p);
            this.zgeografija
                .where('kategorija', '==', kategorija)
                .where('pojam', '==', pojam)
                .get()
                .then( snapshot => {
                    snapshot.docs.forEach( doc => {
                        if(doc.data()) {
                            x = false;
                        }
                    });
                    callback(x);
                })
                .catch( error => {
                   console.log(error);
                });

        }
}