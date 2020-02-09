const mjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
Pozivi.ucitaj("/json/zauzeca.json");
Pozivi.ubaciOsoblje();
Pozivi.ucitajIzBaze();

window.onclick = e => {
    let element = e.target;

    if (element.className === "pojedinacanDatum") {

    if(window.confirm("Zelite li rezervisati odabrani termin?")) {

        let sala = document.getElementById("sale").value;
        let periodicna = document.getElementById("periodicna").checked;
        let pocetak = document.getElementById("pocetak").value;
        let kraj = document.getElementById("kraj").value;
        let dan = parseInt(element.innerHTML);
        let mjesec = document.querySelector(".mjesec").innerHTML;
        let brojMjeseca = mjeseci.indexOf(mjesec);
        let trenutnaGodina = new Date().getFullYear();
        console.log("godinaaaaaa",trenutnaGodina);
        let predavac=document.getElementById("osoblje").value;

        let datum = dan + "/" + String(brojMjeseca + 1) + "/" + trenutnaGodina;
        if (document.querySelector(".datum :nth-child(1)").style.borderBottom=="red solid 20px") {
           // Pozivi.vratiOsobuRezervacije(sala,datum,pocetak,kraj,periodicna);
            window.alert("Nije moguće rezervisati salu " + sala + " za navedeni datum " + datum + " i termin od "
                + pocetak + " do " + kraj + "!");
        }

    else {

        if (periodicna) {

                let brojMjeseca = mjeseci.indexOf(mjesec);
                console.log(brojMjeseca);
                var semestar;
                if (brojMjeseca < 1 || brojMjeseca > 8) {
                    semestar = "zimski";
                }
                else if (brojMjeseca > 0 && brojMjeseca < 5) {
                    semestar = "ljetni";
                }

                let prviDan = new Date(new Date().getFullYear(), brojMjeseca, 1).getDay();
                if (prviDan == 0) prviDan = 7;
                prviDan--;

                dan = (dan + prviDan - 1) % 7;

                let periodicnoZauzece = { "dan": dan, "semestar": semestar, "pocetak": pocetak, "kraj": kraj, "naziv": sala, "predavac": predavac };
                Pozivi.rezervisi(periodicnoZauzece, brojMjeseca);
              //  Pozivi.ubaciUbazu(dan,semestar,pocetak,kraj,sala,predavac);
            }
            else {
                let godina = new Date().getFullYear();
                let stringDana = String(dan);
                if (dan < 10) {
                    stringDana = "0" + stringDana;
                }
                var semestar;
                if (brojMjeseca < 1 || brojMjeseca > 8) {
                    semestar = "zimski";
                }
                else if (brojMjeseca > 0 && brojMjeseca < 5) {
                    semestar = "ljetni";
                }
                let stringMjeseca = String(brojMjeseca+1);
                if (brojMjeseca < 10) {
                    stringMjeseca = "0" + stringMjeseca;
                }
                let datum = stringDana + "/" + stringMjeseca + "/" + String(godina);
                let vanrednoZauzece = { "datum": datum, "pocetak": pocetak, "kraj": kraj, "naziv": sala, "predavac": predavac };


                Pozivi.rezervisi(vanrednoZauzece, brojMjeseca);
              //  Pozivi.ubaciUbazu(datum,semestar,pocetak,kraj,sala,predavac);
            }
        }
    }
}
}