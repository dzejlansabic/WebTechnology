//import { Osoblje } from "./db";

//var htmlRef;
var  ucitavanjeSlikaAjax=(function(){
    var konstruktor=function(divSlika1, divSlika2, divSlika3) {
        var ajax=new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let odgovor=JSON.parse(ajax.responseText);
                
                for(var i=0;i<3;i++){
                    let sadrzaj=' ';
                    if(i==0){
                        sadrzaj=sadrzaj+'<img src="'+odgovor.slika1+'" alt="slikica" class="zaSlike">';
                        divSlika1.innerHTML=sadrzaj;
                    }
                    else if(i==1){
                        sadrzaj=sadrzaj+'<img src="'+odgovor.slika2+'" alt="slikica" class="zaSlike">';
                        divSlika2.innerHTML=sadrzaj;
                    }
                    else{
                        sadrzaj=sadrzaj+'<img src="'+odgovor.slika3+'" alt="slikica" class="zaSlike">';
                        divSlika3.innerHTML=sadrzaj;
                    }
                }
            }
        };
        ajax.open('GET','http://localhost:8080/slike?brSlike='+1,true);
        ajax.setRequestHeader("Content-Type","application/json");
        ajax.send();
        return {
            vratiSlike:function(brojSlika) {
                ajax.open('GET','http://localhost:8080/slike?brSlike='+brojSlika,true);
                ajax.setRequestHeader("Content-Type","application/json");
                ajax.send();
            }
        }
    };

    return konstruktor;
}());
var div1=document.getElementById("slika1");
var div2=document.getElementById("slika2");
var div3=document.getElementById("slika3");
var a=new ucitavanjeSlikaAjax(div1,div2,div3);
var i=1;
var dugmelijevo=document.getElementById("prethodneSlike");
var dugmedesno=document.getElementById("slijedeceSlike");
function desnoSlika(){
    a.vratiSlike(i+1);
    i++;    
    if(i==4){ 
        div2.hidden=true;
        div3.hidden=true;
        dugmedesno.disabled = true;
        dugmelijevo.disabled=false;
    } else {
        div2.hidden=false;
        div3.hidden=false;
        dugmedesno.disabled = false;
        dugmelijevo.disabled=false;
    }
}
function lijevoSlika() {
    a.vratiSlike(i-1);
    i--;
    if(i==1) {
        dugmelijevo.disabled = true;
        dugmedesno.disabled=false;
    } else {
        div2.hidden=false;
        div3.hidden=false;
        dugmelijevo.disabled = false;
        dugmedesno.disabled=false;
    }
}

let Pozivi = (function () {

    const zimski = [9, 10, 11, 0];
    const ljetni = [1, 2, 3, 4];
    var sedmica = ["Ponedjeljak", "Utorak", "Srijeda", "Cetvrtak", "Petak", "Subota", "Nedjelja"];
    var listaZauzeca = [];

    // privatni atributi

    function ucitajImpl(zauzeca) {

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    JSONzauzeca = JSON.parse(xhttp.responseText);

                    console.log(JSONzauzeca);
                    Kalendar.ucitajPodatke(JSONzauzeca.periodicna, JSONzauzeca.redovna);
                }
            };
            xhttp.open("GET", zauzeca , true);
            xhttp.send();
        }
    function iscrtajKalendarImpl(kalendarRef, mjesec) {
    }
    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
    }

    function rezervisiImpl(zauzece, trenutniMjesec) {

        // kako bi znali pritisnut datum na kalendaru za periodicno zauzece

        let datum = zauzece.datum;
        console.log("neki datuuuum", datum);
        mjesec = trenutniMjesec + 1;
        let trenutnaGodina = new Date().getFullYear();

        let stringMjeseca = String(mjesec);
        if (mjesec < 10) {
            stringMjeseca = "0" + stringMjeseca;
        }


        /* if (datum != undefined) {

            // vanredno zauzece , ali trazi se drugi format datuma
            let tempNiz = datum.split(".");
            let stringDana = tempNiz[0];
            if (stringDana.lenght < 2) {
                stringDana = "0" + stringDana;
            }
            datum = stringDana + "/" + stringMjeseca + "/" + tempNiz[2];

        } */

        let sala = document.getElementById("sale").value;
        let pocetak = document.getElementById("pocetak").value;
        let kraj = document.getElementById("kraj").value;
        let prviDan = new Date(trenutnaGodina, trenutniMjesec - 1, zauzece.dan).getDay();

        let ajax = new XMLHttpRequest();
        odobrenaRezervacija = true;

        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && (this.status == 200 || this.status == 250 || this.status == 270)) {
                JSONzauzeca = JSON.parse(ajax.responseText);

                console.log("status", this.status);


                Kalendar.ucitajPodatke(JSONzauzeca.periodicna, JSONzauzeca.redovna);
                //Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
                Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, pocetak, kraj);

                listaZauzeca = [];
                prilagodiUcitavanje(listaZauzeca, JSONzauzeca.redovna, JSONzauzeca.periodicna);

                switch (this.status) {
                    case 270:
                        console.log("U funkcijiii");
                        //vratiOsobuRezervacije(sala,datum,pocetak,kraj,false);
                        alert("Nije moguće rezervisati salu " + sala + " za navedeni datum " + datum +
                            " i termin od " + pocetak + " do " + kraj + "! Rezervisana od Neko");

                        //  ucitajImpl("/json/zauzeca.json");
                        break;

                    case 250:

                        alert("Nije moguće rezervisati salu " + sala + " periodicno u " + sedmica[prviDan] + ", " +
                            getSemestar(trenutniMjesec) + " semestar, u vrijeme od " + pocetak + " do " + kraj + "! Rezervisana od Neko");
                        break;
                }
            }   ;

        }
        ajax.open("POST", "/http://localhost:8080/html/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        let trenutniSemestar = zauzece.semestar;
        if (zauzece.semestar !== "ljetni" && zauzece.semestar !== "zimski") {
            trenutniSemestar = "";
        }
        console.log(trenutniSemestar);

        if (zauzece.dan != undefined && trenutniSemestar === "") {
            alert("Nije moguće rezervisati salu " + sala + " periodicno za vrijeme raspusta sa pocetkom od " + pocetak + " do " + kraj + "!");
            return;
        }

        ajax.send(JSON.stringify(zauzece));
    }

    function prilagodiUcitavanje(listaZauzeca, vanredna, periodicna) {

        vanredna.forEach(element => {
            listaZauzeca.push ({datum:element.datum, pocetak:element.pocetak, kraj:element.kraj,naziv:element.naziv, predavac:element.predavac})
        });

        periodicna = periodicna.filter(element => {
            return Kalendar.isRegularnoRedovnoZauzece(element);
        });

        periodicna.forEach(element => {
            for (var i = element.dan; i <= 31; i += 7) {

                var trenutna={dan:i,semestar:element.semestar, pocetak:element.pocetak, kraj:element.kraj,naziv:element.naziv, predavac:element.predavac}
                listaZauzeca.push(trenutna);
            }
        });
    }
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

function ubaciUbazu(dan,semestar,pocetak,kraj,sala,predavac) {
        
     let osoblje=document.getElementById("osoblje").value;
     let ajaxZahtjev = new XMLHttpRequest();
     ajaxZahtjev.open('GET', 'http://localhost:8080/ubaciUbazu?dan='+dan+'&semestar='+semestar+'&pocetak='+pocetak+'&kraj='+kraj+'&sala='+sala+'&ime='+predavac, true);
     ajaxZahtjev.send();
     ajaxZahtjev.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.alert(this.responseText);
        };
    }
}

    function ubaciOsoblje() {
     let osoblje=document.getElementById("osoblje");
     let ajaxZahtjev = new XMLHttpRequest();
     ajaxZahtjev.open("GET", "http://localhost:8080/osoblje", true);
     ajaxZahtjev.send();
     ajaxZahtjev.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            JSONosoblje = JSON.parse(ajaxZahtjev.responseText);
            for(var i=0; i<JSONosoblje.length;i++) {
                var option=document.createElement("option");
                option.text = JSONosoblje[i].ime;
                osoblje.appendChild(option);
            }
        };
    }}
     function vratiOsobuRezervacije(sala,datum,pocetak,kraj,periodicna) {
     let ajaxZahtjev = new XMLHttpRequest();
     ajaxZahtjev.open("GET", 'http://localhost:8080/vratiOsoblje?sala='+sala+'&datum='+datum+'&pocetak='+pocetak+'&kraj='+kraj+'&periodicna='+periodicna, true);
     ajaxZahtjev.send();
     ajaxZahtjev.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var ime="defaultno";
            var imeOsobe="defaultno";
            var JSONrezervacija = JSON.parse(ajaxZahtjev.responseText);
            imeOsobe=JSONrezervacija[0].ime;
            ime=JSONrezervacija[0].ime;
            window.alert("Nije moguće rezervisati salu " + sala + " za navedeni datum " + datum + " i termin od "
                + pocetak + " do " + kraj + "!" +"Rezervisana je već od osobe "+ime);
        };
    } 
    } 

    function ucitajIzBaze() {

        let ajaxZahtjev = new XMLHttpRequest();
        ajaxZahtjev.onreadystatechange = function () {
           if (this.readyState == 4 && this.status == 200) {
               JSONzauzeca = JSON.parse(ajaxZahtjev.responseText);
               Kalendar.ucitajPodatke(JSONzauzeca.periodicna, JSONzauzeca.redovna);
           };
       }
       ajaxZahtjev.open("GET", "ucitavanje", true);
        ajaxZahtjev.send();
    }
    return {
       ucitajIzBaze:ucitajIzBaze,
       ubaciUbazu:ubaciUbazu,
        ubaciOsoblje:ubaciOsoblje,
        vratiOsobuRezervacije:vratiOsobuRezervacije,
        obojiZauzeca: obojiZauzecaImpl,
        ucitaj: ucitajImpl,
        rezervisi: rezervisiImpl,
        iscrtajKalendar: iscrtajKalendarImpl,
    }
}());