export class Game {


    constructor(korisnik) {
        this._korisnik = korisnik;
        this.zgeografija = db.collection('zgeografija');
        this._categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']; 
        this._playerAnswers = []; //array of objects: {kategorija: kategorija, odgovor: odgovor, tacno:false, score:0}
        this._aiAnswers = []; //array of objects: {kategorija: kategorija, odgovor: odgovor, tacno:false, score:0}
        this._letter
        this._time = 60;
        this._playerScore;
        this._aiScore;
    }

    set korisnik(name){  
        this._korisnik = name;      
    }

    get korisnik(){
        return this._korisnik;
    }
    set time(num){  
        this._time = num;      
    }

    get time(){
        return this._time;
    }

    set aiAnswers(array){  
        this._aiAnswers = array;      
    }

    get aiAnswers(){
        return this._aiAnswers;
    }

    set playerAnswers(array){  
        this._playerAnswers = array;      
    }

    get playerAnswers(){
        return this._playerAnswers;
    }

    set categories(array){
        this._categories = array; 
    }

    get categories(){
        return this._categories;
    }

    set letter(x){
        this._letter = x;
    }

    get letter(){
        return this._letter;
    }

    set playerScore(num){  
        this._playerScore = num;      
    }

    get playerScore(){
        return this._playerScore;
    }

    set aiScore(num){  
        this._aiScore = num;      
    }

    get aiScore(){
        return this._aiScore;
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


    setTimer = () => {
        let countdown = ()=> {
            if (this.time>0){
                divTimer.innerText = `Preostalo vreme: ${this.time}`; 
                this.time--;
            }else{
                divTimer.style.color = "red";
                divTimer.innerText = 'Vreme je isteklo!';
                clearInterval(timerInterval);
            }
        }
        let timerInterval = setInterval(countdown, 1000);

        let event = ()=>{
            divTimer.style.color = "red";
            divTimer.innerText = 'Vreme je isteklo!';
            buttonSubmitAnswers.click()
            clearInterval(timerInterval);
        }
        let timerTimeout =setTimeout(event, this.time*1000+1000);
        return timerTimeout;
        
    }

    randomLetter = () =>{
        let LettersArray = [ 
            `A`, `B`, `C`, `Č`, `Ć`, `D`, `Dž`, `Đ`, `E`, `F`, 
            `G`, `H`, `I`, `J`, `K`, `L`, `Lj`, `M`, `N`, `Nj`, 
            `O`, `P`, `R`, `S`, `Š`, `T`, `U`, `V`, `Z`, `Ž` ]
        let randomIndex = Math.floor(Math.random() * 30);
        let randomLetter = LettersArray[randomIndex];
        this.letter = randomLetter;
        return randomLetter;
    }

    getPlayerAnswers(inputPlayer){
        let playerAnswersArray = [];
        inputPlayer.forEach((inputField, index) =>{
            playerAnswersArray.push({'kategorija': this.categories[index], 'odgovor': this.stringCheck(inputField.value), 'tacno':false, 'poeni':0});
        })
        this.playerAnswers = playerAnswersArray;
        return this;
    }
 
    getAnswersArray(){

        let answersArray = []; 
        this.playerAnswers.forEach(answer=>{
            answersArray.push(answer.odgovor)
        })
        
        return answersArray;

    }

    checkPlayerAnswers(){
       let answers = this.getAnswersArray()
       let promises = [];

        answers.forEach((answer, i)=>{
            promises.push(this.zgeografija
                .where('kategorija', '==', this.categories[i])
                .where('pocetnoSlovo', '==', this.letter)
                .where('pojam', '==', answer)
                .get()
            )
        })

        Promise.all(promises).then(promise => {
            promise.forEach((snapshot,i) => {
                if (snapshot.docs.length>0){
                    console.log(`Pojam ${answers[i]} se nalazi u bazi!`)
                    this.playerAnswers[i].tacno = true;

                } else {
                    console.log('Netačan odgovor') 
                }
            })
        console.log(this.playerAnswers)

        })
    }

    generateAiAnswer(category){
        
        this.aiAnswers.push({'kategorija': category, 'odgovor': "/", 'tacno': false, 'poeni':0})
        let chance = Math.random();
        let kategorija = category;
        let key = this.zgeografija.doc().id;
        function appropriateCategory(answ){
            return answ.kategorija === kategorija;
        }
        this.zgeografija
            .where('kategorija', '==', kategorija)
            .where('pocetnoSlovo', '==', this.letter)
            .where(firebase.firestore.FieldPath.documentId(), '>=', key)
            .limit(1)
            .get()
            .then(snapshot => {
                if(snapshot.size > 0) {
                    snapshot.forEach(doc => {
                        if (chance > 0.2){
                            this.aiAnswers.find(appropriateCategory).odgovor = doc.data().pojam;
                            this.aiAnswers.find(appropriateCategory).tacno = true;
                        } 
                    });
                }
                else {
                    this.zgeografija
                    .where('kategorija', '==', kategorija)
                    .where('pocetnoSlovo', '==', this.letter)
                    .where(firebase.firestore.FieldPath.documentId(), '<', key)
                    .limit(1)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            if (chance > 0.2){
                                this.aiAnswers.find(appropriateCategory).odgovor = doc.data().pojam;
                                this.aiAnswers.find(appropriateCategory).tacno = true;
                            } 
                        });
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }   

    compareAnswers(){
        let winner
        this.categories.forEach((category,i) =>{
            if (this.playerAnswers[i].tacno && !this.aiAnswers[i].tacno) {
                this.playerAnswers[i].poeni = 15;
                console.log(`${category}: Igrač dobija 15 poena za pojam ${this.playerAnswers[i].odgovor}, a kompjuter 0`)
            } else if (!this.playerAnswers[i].tacno && this.aiAnswers[i].tacno){
                this.aiAnswers[i].poeni = 15;
                console.log(`${category}: Kompjuter dobija 15 poena za pojam ${this.aiAnswers[i].odgovor}, a igrač 0`)
            } else if (this.playerAnswers[i].odgovor === this.aiAnswers[i].odgovor){
                this.playerAnswers[i].poeni = 5;
                this.aiAnswers[i].poeni = 5;
                console.log(`${category}: Igrač i kompjuter dobijaju po 5 poena za pojam ${this.playerAnswers[i].odgovor}`)
            } else if ((this.playerAnswers[i].tacno && this.aiAnswers[i].tacno) && (this.playerAnswers[i].odgovor !== this.aiAnswers[i].odgovor)){
                this.playerAnswers[i].poeni = 10;
                this.aiAnswers[i].poeni = 10;
                console.log(`${category}: Igrač i kompjuter dobijaju po 10 poena za pojmove ${this.playerAnswers[i].odgovor} i ${this.aiAnswers[i].odgovor} `)
            } else {
                console.log(`${category}: Ni igrač ni kompjuter nisu tačno odgovorili`)
            }
        })
        this.playerScore = this.playerAnswers.reduce((a,b) => a + b.poeni, 0)
        this.aiScore = this.aiAnswers.reduce((a,b) => a + b.poeni, 0)
        console.log(`${this.korisnik} je osvojio ${this.playerScore} poena`)
        console.log(`Kompjuter je osvojio ${this.aiScore} poena`)


    }
  
        
    declareWinner(){
        let winner;
        if(this.playerScore > this.aiScore){
            winner = this.korisnik;
            console.log(`Pobednik je ${winner}! Čestitamo!`)
        } else if (this.playerScore < this.aiScore) {
            winner = 'kompjuter';
            console.log(`Pobednik je ${winner}!`)
        } else {
            console.log(`Nerešeno!`)
        }
        return winner;
    }

}
