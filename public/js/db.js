const Sequelize = require('sequelize');
const sequelize = new Sequelize('DBWT19', 'root', 'root', {
   host: 'localhost',
   dialect: 'mysql',
   pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
   }
});
const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.Osoblje=sequelize.import('../models/Osoblje.js');
db.Rezervacija=sequelize.import('../models/Rezervacija.js');
db.Sala=sequelize.import('../models/Sala.js');
db.Termin=sequelize.import('../models/Termin.js');


db.Osoblje.hasMany(db.Rezervacija, {as: 'osobljerezervacija',foreignKey:'osoba'});
db.Rezervacija.belongsTo(db.Osoblje, {as: 'rezervacijaosoblje', foreignKey:'osoba'});
db.Termin.hasOne(db.Rezervacija, {as: 'terminrezervacija', foreignKey:'termin'});
db.Rezervacija.belongsTo(db.Termin, {as:'rezervacijatermin', foreignKey:'termin'});
db.Sala.hasMany(db.Rezervacija, {as: 'salarezervacija',foreignKey:'sala'});
db.Rezervacija.belongsTo(db.Sala, {as: 'rezervacijasala', foreignKey: 'sala'});
db.Osoblje.hasOne(db.Sala, {as:'zaduziOsobu', foreignKey:'zaduzenaOsoba'});
db.Sala.belongsTo(db.Osoblje, {as: 'zaduziSalu', foreignKey:'zaduzenaOsoba'});



/* sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija() {
    var osobljeListaPromisea=[];
    var saleListaPromisea=[];
    var rezervacijeListaPromisea=[];
    var terminiListaPromisea=[];

    return new Promise(function(resolve,reject) {
        osobljeListaPromisea.push(db.Osoblje.create({ime:'Neko', prezime:'Nekić',uloga:'profesor'}));
        osobljeListaPromisea.push(db.Osoblje.create({ime:'Drugi', prezime:'Neko',uloga:'asistent'}));
        osobljeListaPromisea.push(db.Osoblje.create({ime:'Test', prezime:'Test',uloga:'asistent'}));
        Promise.all(osobljeListaPromisea).then(function(osoblje){
            var NekoOsoblje=osoblje.filter(function(o){return o.ime==='Neko'})[0];
            var DrugiOsoblje=osoblje.filter(function(o){return o.ime==='Drugi'})[0];
            var TestOsoblje=osoblje.filter(function(o){return o.ime==='Test'})[0];

            saleListaPromisea.push(
                db.Sala.create({naziv:'1-11',zaduzenaOsoba:NekoOsoblje.id}).then(function(k){
                    return new Promise(function(resolve,reject){resolve(k);});
                })
            );
            saleListaPromisea.push(
                db.Sala.create({naziv:'1-15',zaduzenaOsoba:DrugiOsoblje.id}).then(function(k){
                    return new Promise(function(resolve,reject){resolve(k);});
                })
            );
        Promise.all(saleListaPromisea).then(function(sale){
            var PrvaSala=sale.filter(function(k){return k.naziv==='1-11'})[0];
            var DrugaSala=sale.filter(function(k){return k.naziv==='1-15'})[0];
            terminiListaPromisea.push(
                db.Termin.create({redovni:false,dan:null,datum:"01.01.2020",semestar:null,pocetak:'12:00',kraj:'13:00'}).then(function(b){
                    return new Promise(function(resolve,reject){resolve(b);});
                })
            );
            terminiListaPromisea.push(
                db.Termin.create({redovni:true,dan:0,datum:null,semestar:'zimski',pocetak:'13:00',kraj:'14:00'}).then(function(b){
                    return new Promise(function(resolve,reject){resolve(b);});
                })
            );
            Promise.all(terminiListaPromisea).then(function(termini){
                rezervacijeListaPromisea.push(
                    db.Rezervacija.create({termin:1, sala:PrvaSala.id,osoba:NekoOsoblje.id}).then(function(b){
                        return new Promise(function(resolve,reject){resolve(b);});
                    })
                );
                rezervacijeListaPromisea.push(
                    db.Rezervacija.create({termin:2, sala:PrvaSala.id,osoba:TestOsoblje.id}).then(function(k){
                        return new Promise(function(resolve,reject){resolve(k);});
                    })
                );
                Promise.all(rezervacijeListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Rezervacije greska "+err);});
            }).catch(function(err){console.log("Termin greska "+err);});
        }).catch(function(err){console.log("Sale greska "+err);});
        }).catch(function(err){console.log("Osoblje greska "+err);});
    });
} */

function primjeriUpita() {
    db.Osoblje.findAll({where:{}}).then(function(resSet){
        console.log("Lista osoblja");
        resSet.forEach(Osoblje => {
            console.log("\t"+Osoblje.ime);
        });               
    });
}
primjeriUpita();
module.exports=db;