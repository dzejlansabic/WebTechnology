const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs');
const xhttp = require('http');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = require("./public/js/db");
app.get('/', function (req, res) {
     res.sendFile(__dirname + '/public/html/pocetna.html');
});

app.get('/slike', function (req, res) {
     let brojSlike = req.query.brSlike;
     if (brojSlike == 1) {
          res.json({
               slika1: "/photos/slika1.jpg", slika2: "/photos/slika2.jpg",
               slika3: "/photos/slika3.jpg"
          });
     }
     if (brojSlike == 2) {
          res.json({ slika1: "/photos/slika4.jpg", slika2: "/photos/slika5.jpg", slika3: "/photos/slika6.jpg" });

     }
     if (brojSlike == 3) {
          res.json({ slika1: "/photos/slika7.jpg", slika2: "/photos/slika8.jpg", slika3: "/photos/slika9.jpg" });
     }
     if (brojSlike == 4) {
          res.json({ slika1: "/photos/slika10.jpg" });
     }
});

app.post("/http://localhost:8080/html/rezervacija.html", function (req, res) {

     let novoZauzece = JSON.parse(JSON.stringify(req.body));
     fs.readFile('public/json/zauzeca.json', 'utf-8', function (err, data) {
          if (err) throw err;

          var objekti = JSON.parse(data);
          let flag = false; 

          if (novoZauzece.dan != null) {

               for (let i = 0; i < objekti.periodicna.length; i++) {

                    if (objekti.periodicna[i].dan == novoZauzece.dan && objekti.periodicna[i].semestar == novoZauzece.semestar && objekti.periodicna[i].naziv == novoZauzece.naziv
                         && porediVrijeme(objekti.periodicna[i].pocetak, novoZauzece.kraj) <= 0 && porediVrijeme(novoZauzece.pocetak, objekti.periodicna[i].kraj) <= 0) {
                         flag = true;
                         res.statusCode = 250;
                         break;
                    }
               }
               if (!flag) {
                    for (let i = 0; i < objekti.redovna.length; i++) {

                         let nizDatum = objekti.redovna[i].datum.split("/");//IZMJENA
                         let dan = parseInt(nizDatum[0]);
                         let mjesec = parseInt(nizDatum[1]);
                         let godina = parseInt(nizDatum[2]);

                         let prviDan = (new Date(godina, mjesec, dan).getDay()) % 7;
                         if (prviDan == 0) prviDan = 7;
                         prviDan--;

                         let semestar = getSemestar(mjesec);
                         console.log(objekti.redovna[i]);
                         if (objekti.redovna[i].naziv == novoZauzece.naziv && prviDan == novoZauzece.dan && semestar == novoZauzece.semestar
                              && porediVrijeme(objekti.redovna[i].pocetak, novoZauzece.kraj) <= 0 && porediVrijeme(novoZauzece.pocetak, objekti.redovna[i].kraj) <= 0) {
                              flag = true;

                              res.statusCode = 250;
                              break;
                         }
                    }
               }
               if (!flag) {
                    objekti.periodicna.push(novoZauzece);
               }
          }
          else {
               for (let i = 0; i < objekti.redovna.length; i++) {
                    if (objekti.redovna[i].datum == novoZauzece.datum && objekti.redovna[i].naziv == novoZauzece.naziv
                         && porediVrijeme(objekti.redovna[i].pocetak, novoZauzece.kraj) <= 0 && porediVrijeme(novoZauzece.pocetak, objekti.redovna[i].kraj) <= 0) {
                         flag = true;
                         res.statusCode = 270;
                         break;
                    }
               }
               if (!flag) {

                    let nizDatum = novoZauzece.datum.split("/");
                    let dan = parseInt(nizDatum[0]);
                    let mjesec = parseInt(nizDatum[1]);
                    let godina = parseInt(nizDatum[2]);

                    let prviDan = new Date(godina, mjesec, dan).getDay();
                    if (prviDan == 0) prviDan = 7;
                    prviDan--;

                    let semestar = getSemestar(mjesec);

                    for (let i = 0; i < objekti.periodicna.length; i++) {
                         if (objekti.periodicna[i].dan == prviDan && semestar == objekti.periodicna[i].semestar && objekti.periodicna[i].naziv == novoZauzece.naziv
                              && porediVrijeme(objekti.periodicna[i].pocetak, novoZauzece.kraj) <= 0 && porediVrijeme(novoZauzece.pocetak, objekti.periodicna[i].kraj) <= 0) {

                              flag = true;
                              res.statusCode = 270;
                              break;
                         }
                    }
               }
               if (!flag) {
                    objekti.redovna.push(novoZauzece);
               }
          }
          if (!flag) {
               fs.writeFile('public/json/zauzeca.json', JSON.stringify(objekti), function (err) {
                    if (err) throw err;
               })
          }
          res.send(JSON.stringify(objekti));
     })

});

app.get('/osoblje', function (req, res) {
     db.Osoblje.findAll().then(function (osob) {
          res.send(JSON.stringify(osob));
     })
});

app.get('/vratiIme', function (req, res) {
     db.Osoblje.findOne({ where: { id: req.query.idOsobe } }).then(function (ter) {
          res.send(ter.ime);
     })
});

app.get('/vratiOsobeMjesto', function (req, res) {

     db.Termin.findAll({ where: {} }).then(function (ter) {
          db.Rezervacija.findAll({ where: {} }).then(function (rez) {
               db.Osoblje.findAll({ where: {} }).then(function (osob) {
                    db.Sala.findAll({ where: {} }).then(function (sal) {
                         var lista={termini: ter, rezervacije:rez, osoblje:osob, sale:sal};
                         res.send(JSON.stringify(lista));
                    })
               })
          });
     }) 
});

app.get('/vratiOsoblje', function (req, res) {

     if (req.params.datum==undefined) {
          db.Termin.findOne({ where: { dan: req.params.datum } }).then(function (ter) {
               db.Rezervacija.findAll({ where: { termin: ter.id } }).then(function (resSet) {
                    db.Osoblje.findOne({ where: { id: resSet.osoba } }).then(function (i) {
                         res.send(JSON.stringify(i));
                    })
               });
          })
     }
     else {
          db.Termin.findOne({ where: { datum: req.params.datum } }).then(function (ter) {
               db.Rezervacija.findAll({ where: { termin: ter.id } }).then(function (resSet) {
                    db.Osoblje.findOne({ where: { id: resSet.osoba } }).then(function (i) {
                         res.send(JSON.stringify(i));
                    })
               });
          })
     }
});

app.get('/zauzeca.json', function (req, res) {
     res.sendFile(__dirname + "/zauzeca.json");
});

app.get('/html/ucitavanje', function (req, res) {
     console.log("ucitavanje");
     db.Rezervacija.findAll({
          include: [{ model: db.Termin, as: "rezervacijatermin" },
          { model: db.Sala, as: "rezervacijasala"},
          { model: db.Osoblje, as: "rezervacijaosoblje" }
          ]
     }).then(function (zauzeca) {
          let listaZauzeca = [];
          let periodicna = [];
          let redovna = [];

     for (let i = 0; i < zauzeca.length; i++) {

          let trenutni = zauzeca[i];
          let pocetak = trenutni.rezervacijatermin.pocetak;
          let kraj = trenutni.rezervacijatermin.kraj;
          let predavac = trenutni.rezervacijaosoblje.ime + " " + trenutni.rezervacijaosoblje.prezime;
          let uloga = trenutni.rezervacijaosoblje.uloga;
          let sala = trenutni.rezervacijasala.naziv;

          let datum = trenutni.rezervacijatermin.datum;

          if (datum == null) {
               let dan = trenutni.rezervacijatermin.dan;
               let semestar = trenutni.rezervacijatermin.semestar;
               let trenutno = { dan: dan, semestar: semestar, pocetak: pocetak, kraj: kraj, naziv: sala, predavac: predavac };
               periodicna.push(trenutno);
          }
          else {
               let trenutno = { datum: datum, pocetak: pocetak, kraj: kraj, naziv: sala, predavac: predavac };
               redovna.push(trenutno);
          }
     }
     listaZauzeca = { periodicna: periodicna, redovna: redovna };
          res.send(JSON.stringify(listaZauzeca));
     });
});

app.get('/ubaciUbazu', function (req, res) {
     var dat = req.query.datum;

     db.Sala.findOne({ where: { naziv: req.query.sala } }).then(function (os) {
          bsala = os;
          db.osoblje.findOne({ where: { ime: req.query.ime } }).then(function (oo) {
               db.termin.findOne({ where: { datum: dat, pocetak: req.query.pocetak, kraj: req.query.kraj } }).then(function (ot) {
                    if (ot === null) {
                         db.termin.create({ redovni: false, datum: dat, pocetak: req.query.pocetak, kraj: req.query.kraj }).then(function () {
                              db.termin.findOne({ where: { datum: dat, pocetak: req.query.pocetak, kraj: req.query.kraj } }).then(function (ot2) {
                                   db.rezervacije.create({ termin: ot2.id, sala: os.id, osoba: oo.id }).then(function () {

                                        db.rezervacije.findAll().then(function (or) {
                                             var per = [];
                                             var van = [];
                                             var idemo = or.length;
                                             for (var i = 0; i < or.length; i++) {
                                                  var ter = or[i].termin;
                                                  var sal = or[i].sala;
                                                  var oso = or[i].osoba
                                                  var termin_n;
                                                  var osoba_n;
                                                  var sala_n;
                                                  db.termin.findOne({ where: { id: ter } }).then(function (ot) {
                                                       termin_n = ot;
                                                  });
                                                  db.sala.findOne({ where: { id: sal } }).then(function (os) {
                                                       sala_n = os;
                                                  });
                                                  db.osoblje.findOne({ where: { id: oso } }).then(function (oo) {
                                                       osoba_n = oo;
                                                       if (termin_n.redovni == true) {
                                                            var obj = { "dan": termin_n.dan, "semestar": termin_n.semestar, "pocetak": termin_n.pocetak, "kraj": termin_n.kraj, "naziv": sala_n.naziv, "predavac": osoba_n.ime };
                                                            per.push(obj);
                                                       }
                                                       else {
                                                            var ob2 = { "datum": termin_n.datum, "pocetak": termin_n.pocetak, "kraj": termin_n.kraj, "naziv": sala_n.naziv, "predavac": osoba_n.ime };
                                   
                                                            van.push(ob2);
                                                       }
                                                       if (per.length + van.length === idemo) {

                                                            var ob_per = { "periodicna": per, "vandredna": van };
                                                            console.log(ob_per);
                                                            res.send(ob_per);
                                                       }

                                                  });
                                             }
                                        });
                                   });
                              });
                         });

                    }
                    else {
                         res.send({ "ime": oo.ime, "prezime": oo.prezime });
                    }
               });
          });
     });
});

db.sequelize.sync({ force: true }).then(function () {
     inicializacija().then(function () {
          console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
          //process.exit();
     });
});

function inicializacija() {
     var osobljeListaPromisea = [];
     var saleListaPromisea = [];
     var rezervacijeListaPromisea = [];
     var terminiListaPromisea = [];

     return new Promise(function (resolve, reject) {
          osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Neko', prezime: 'Nekić', uloga: 'profesor' }));
          osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Drugi', prezime: 'Neko', uloga: 'asistent' }));
          osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Test', prezime: 'Test', uloga: 'asistent' }));
          Promise.all(osobljeListaPromisea).then(function (osoblje) {
               var NekoOsoblje = osoblje.filter(function (o) { return o.ime === 'Neko' })[0];
               var DrugiOsoblje = osoblje.filter(function (o) { return o.ime === 'Drugi' })[0];
               var TestOsoblje = osoblje.filter(function (o) { return o.ime === 'Test' })[0];

               saleListaPromisea.push(
                    db.Sala.create({ naziv: '1-11', zaduzenaOsoba: NekoOsoblje.id }).then(function (k) {
                         return new Promise(function (resolve, reject) { resolve(k); });
                    })
               );
               saleListaPromisea.push(
                    db.Sala.create({ naziv: '1-15', zaduzenaOsoba: DrugiOsoblje.id }).then(function (k) {
                         return new Promise(function (resolve, reject) { resolve(k); });
                    })
               );
               Promise.all(saleListaPromisea).then(function (sale) {
                    var PrvaSala = sale.filter(function (k) { return k.naziv === '1-11' })[0];
                    var DrugaSala = sale.filter(function (k) { return k.naziv === '1-15' })[0];
                    terminiListaPromisea.push(
                         db.Termin.create({ redovni: false, dan: null, datum: "23/01/2020", semestar: null, pocetak: '12:00', kraj: '13:00' }).then(function (b) {
                              return new Promise(function (resolve, reject) { resolve(b); });
                         })
                    );
                    terminiListaPromisea.push(
                         db.Termin.create({ redovni: true, dan: 0, datum: null, semestar: 'zimski', pocetak: '13:00', kraj: '14:00' }).then(function (b) {
                              return new Promise(function (resolve, reject) { resolve(b); });
                         })
                    );
                    Promise.all(terminiListaPromisea).then(function (termini) {
                         rezervacijeListaPromisea.push(
                              db.Rezervacija.create({ termin: 1, sala: PrvaSala.id, osoba: NekoOsoblje.id }).then(function (b) {
                                   return new Promise(function (resolve, reject) { resolve(b); });
                              })
                         );
                         rezervacijeListaPromisea.push(
                              db.Rezervacija.create({ termin: 2, sala: PrvaSala.id, osoba: TestOsoblje.id }).then(function (k) {
                                   return new Promise(function (resolve, reject) { resolve(k); });
                              })
                         );
                         Promise.all(rezervacijeListaPromisea).then(function (b) { resolve(b); }).catch(function (err) { console.log("Rezervacije greska " + err); });
                    }).catch(function (err) { console.log("Termin greska " + err); });
               }).catch(function (err) { console.log("Sale greska " + err); });
          }).catch(function (err) { console.log("Osoblje greska " + err); });
     });
}
const zimski = [9, 10, 11, 0];
const ljetni = [1, 2, 3, 4];

// funckija pronalaska semestra
function getSemestar(mjesec) {

     if (zimski.includes(mjesec)) {
          console.log("zimski", mjesec);
          return "zimski";
     }
     else if (ljetni.includes(mjesec)) {
          console.log("ljetni", mjesec);
          return "ljetni";
     }
     return "";
}

// funkcija za poredjenje vremena
function porediVrijeme(prvo, drugo) {

     var elementiPrvog = prvo.split(":");
     var elementiDrugog = drugo.split(":");

     var prviDatum = new Date("01/01/2000");
     var drugiDatum = new Date("01/01/2000");

     prviDatum.setHours(elementiPrvog[0]);
     prviDatum.setMinutes(elementiPrvog[1]);
     drugiDatum.setHours(elementiDrugog[0]);
     drugiDatum.setMinutes(elementiDrugog[1]);

     if (prviDatum < drugiDatum) {
          return -1;
     }
     else if (prviDatum == drugiDatum) {
          return 0;
     }
     else {
          return 1;
     }
}
app.listen(8080);