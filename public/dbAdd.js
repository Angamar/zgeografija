import {Geo} from "./GeoClass.js";
let geo = new Geo(localStorage.username);




/*let wordArray = [];
let words = 'Anakonda Antilopa Ajkula Bik Bizon Belaajkula Vidra Veverica Gušter Galeb Gavran Guska Gepard Grizli Dabar Delfin Detlić Divljasvinja Emu Žirafa Žaba Zmija Zebra Zec Jastog Jelen Jež Jazavac Jastreb Jastreb Jarebica Konj Koza Krava Kokoška Kornjača Krtica Kit Lav Leopard Lasta Mačka Muflon Medved Nilskikonj Nosorog Noj Orao Orka Orangutan Pas Papagaj Puma Prepelica Pauk Rakun Rak Roda Ris Raža Slon Sova Soko Som Smuđ Sibirskitigar Slepimiš Sivikit Tigar Tvor Tuna Tarantula Tasmanijskiđavo Ćurka Flamingo Foka Fazan Hrčak Hijena Hobotnica Crv Cvrčak Čaplja Šakal Šaran Antilopa Ajkula Ara Albatros Bizon Bivo Babun Boa Cvrčak Činčila Čavka Čaplja Ćurka Detlić Džeksonovkameleon Đavoljaraža Emu Flamingo Foka Galeb Gavran Hrčak Hijena Irvas Jegulja Jež Kolibri Lav Lemur Lasta Medved Majmun Noj Nosorog Orao Puma Panda Pauk Rak Roda Raža Ris Sova Soko Šakal Tigar Tvor Tetreb Veverica Zebra Žaba Morskoprase Kanarinac Pčela Osa Stršljen Krpelj Bubamara Buva Bubašvaba Svitac Zrikavac Komarac Škorpija Mrav Smrdibuba Leptir Noćnileptir Vaška Stenica Grinja Bogomoljka Termit Uholaža Ušara Morskikrastavac Sunđer Morskijež Meduza Mravojed Skakavac Vilinskikonjic Biljnavaš Morskileopard Pingvin Patka Labud Sipa Kraba Morskazvezda Školjka Lignja Paun Miš Pacov Slepokuče Lama Zamorac Kuna Lisica Kobra Poskok';
wordArray = words.split(' ');
wordArray.forEach(word => {
    geo.checkIfExists('Životinja', word, data => {
        if (data) {
            geo.newTerm('Životinja', word);
        }
    })
});

BRISANJE
.where('kategorija', '==', 'ovde unesite kategoriju')
.get()
.then(snapshot => {
  snapshot.docs.forEach( doc => {doc.ref.delete()})
})
.catch(error => console.log(error)); */

