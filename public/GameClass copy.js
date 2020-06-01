export class GeoUI {


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



    checkPlayerAnswers(){
       let answers = this.getAnswersArray()
       let promises = [];

        answers.forEach((answer, i)=>{
            promises.push(this.zgeografija
                .where('kategorija', '==', this.categories[i])
                .where('pocetnoSlovo', '==', `A`)
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
            .where('pocetnoSlovo', '==', `A`)
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
                    .where('pocetnoSlovo', '==', `A`)
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
                console.log(`${category}: Ni igrač ni kompjuter ne nisu odgovorili`)
            }
        })
        this.playerScore = this.playerAnswers.reduce((a,b) => a + b.poeni, 0)
        this.aiScore = this.aiAnswers.reduce((a,b) => a + b.poeni, 0)
        console.log(`${this.korisnik} je osvojio ${this.playerScore} poena`)
        console.log(`Kompjuter je osvojio ${this.aiScore} poena`)
        if(this.playerScore > this.aiScore){
            winner = this.korisnik;
            console.log(`Pobednik je ${winner}! Čestitamo!`)
        } else if (this.playerScore < this.aiScore) {
            winner = 'kompjuter';
            console.log(`Pobednik je ${winner}!`)
        } else {
            console.log(`Nerešeno!`)

        }

    }
  
        


}
