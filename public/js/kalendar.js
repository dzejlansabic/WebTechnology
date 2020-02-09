var htmlRef;
let Kalendar = (function () {

    var semestri=[ "zimski", "ljetni", "ljetni", "ljetni","ljetni","ljetni","pauza","pauza","pauza","zimski","zimski","zimski" ];
    var zauzeca=new Array();
    var trenutniDatum = new Date();
    var trenutnaGodina = trenutniDatum.getFullYear();
    var trenutniMjesec = trenutniDatum.getMonth();
    const mjesecNaziv = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

    document.getElementById("sale").addEventListener("change", function() {
        var divKal = document.getElementById('datumi');
        ocistiKalendar(divKal);
        iscrtajKalendarImpl(document.getElementById("kalendar"), trenutniMjesec);
        var sala=document.getElementById("sale").value;
        var poc=document.getElementById("pocetak").value;
        var kra=document.getElementById("kraj").value;
        obojiZauzecaImpl(document.getElementById("kalendar"),trenutniMjesec,sala,poc,kra);
    });

    document.getElementById("pocetak").addEventListener("change", function() {
        var divKal = document.getElementById('datumi');
        ocistiKalendar(divKal);
        iscrtajKalendarImpl(document.getElementById("kalendar"), trenutniMjesec);
        var sala=document.getElementById("sale").value;
        var poc=document.getElementById("pocetak").value;
        var kra=document.getElementById("kraj").value;
        obojiZauzecaImpl(document.getElementById("kalendar"),trenutniMjesec,sala,poc,kra);
    });

    document.getElementById("kraj").addEventListener("change", function() {
        var divKal = document.getElementById('datumi');
        ocistiKalendar(divKal);
        iscrtajKalendarImpl(document.getElementById("kalendar"), trenutniMjesec);
        var sala=document.getElementById("sale").value;
        var poc=document.getElementById("pocetak").value;
        var kra=document.getElementById("kraj").value;
        obojiZauzecaImpl(document.getElementById("kalendar"),trenutniMjesec,sala,poc,kra);
    })

    document.getElementById("dugme1").addEventListener("click", function() {
        if(trenutniMjesec!=0) { 
            trenutniMjesec--;
            var divKal = document.getElementById('datumi');
            ocistiKalendar(divKal);
            iscrtajKalendarImpl(document.getElementById("kalendar"), trenutniMjesec);
            var sala=document.getElementById("sale").value;
            var poc=document.getElementById("pocetak").value;
            var kra=document.getElementById("kraj").value;
            obojiZauzecaImpl(document.getElementById("kalendar"),trenutniMjesec,sala,poc,kra);
    }
    })
    document.getElementById("dugme2").addEventListener("click", function() {
        if(trenutniMjesec!=11) { 
            trenutniMjesec++;
            var divKal = document.getElementById('datumi');
            ocistiKalendar(divKal);
            iscrtajKalendarImpl(document.getElementById("kalendar"), trenutniMjesec);
            var sala=document.getElementById("sale").value;
            var poc=document.getElementById("pocetak").value;
            var kra=document.getElementById("kraj").value;
            obojiZauzecaImpl(document.getElementById("kalendar"),trenutniMjesec,sala,poc,kra);
        }
    })
    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
        htmlRef=kalendarRef;
        var prviDan = new Date(trenutnaGodina, trenutniMjesec).getDay();
        if(prviDan==0) prviDan=7;
        var datumi=kalendarRef.getElementsByClassName("pojedinacanDatum");
        var duzina=datumi.length;
        var odstupanje=parseInt(kalendarRef.querySelector(".datum").firstElementChild.style.gridColumnStart)-1;
            for(var i=0; i<zauzeca.length;i++) {
                if(zauzeca[i].semestar!=undefined) { 
                    if(zauzeca[i].semestar==semestri[mjesec] && zauzeca[i].naziv==sala &&
                    ((zauzeca[i].pocetak>=pocetak && zauzeca[i].pocetak<kraj) || (zauzeca[i].kraj>pocetak && zauzeca[i].kraj<=kraj) ||
                    (zauzeca[i].pocetak<=pocetak && zauzeca[i].kraj>=kraj))) {   
                            
                            var k;
                            if(zauzeca[i].dan>=odstupanje) k=zauzeca[i].dan-odstupanje;
                            else k=7-odstupanje+zauzeca[i].dan;
                            for(;k-3<duzina; k+=7) {
                                    if(datumi[k]!=undefined)
                                    datumi[k].style.borderBottom="red solid 20px";
                                //    datumi[k].setAttribute("class", "datum zauzeta");
                            }
                    }
                }
                else{
                    var elem=zauzeca[i].datum.split("/");
                    if(elem[1]==mjesec+1 && zauzeca[i].naziv==sala &&
                        ((zauzeca[i].pocetak>=pocetak && zauzeca[i].pocetak<kraj) || (zauzeca[i].kraj>pocetak && zauzeca[i].kraj<=kraj) ||
                        (zauzeca[i].pocetak<=pocetak && zauzeca[i].kraj>=kraj))  ) { 
                            
                        document.querySelector(".datum :nth-child("+elem[0]+")").style.borderBottom="red solid 20px";
                    }
                }
            }
    }
    function ucitajPodatkeImpl(periodicna, redovna) {
        var j=0;
        for(i=0;  i<periodicna.length;i++ ) {
            zauzeca[i]=periodicna[i];
            j=i;
        }
        for(var i=j;  i< redovna.length; i++ ) {
           zauzeca[periodicna.length+i]=redovna[i];
        }
    }
    function iscrtajKalendarImpl(kalendarRef, mjesec) { 
        document.getElementById("pocetak").defaultValue = "12:00";
        document.getElementById("kraj").defaultValue = "13:00";
        document.querySelector(".mjesec").innerText = mjesecNaziv[trenutniMjesec];
        var prviDan = new Date(trenutnaGodina, trenutniMjesec).getDay();
        var brojDanaMj=32 - new Date(trenutnaGodina, trenutniMjesec, 32).getDate();

        for (var i = 1; i <= brojDanaMj; i++) {
            var divDatum = document.createElement("div");
            divDatum.setAttribute("class", "pojedinacanDatum");
            divDatum.innerText = i;

            document.querySelector(".datum").appendChild(divDatum);
            var dan = document.querySelector(".datum :first-child");

            if(prviDan==0)
                dan.style.gridColumn = prviDan+7;
            else
                dan.style.gridColumn = prviDan;
        }
    }
    function promijeniVrijeme(staroVrijeme) {
        var elementi=staroVrijeme.split(".");
        var novoVrijeme=elementi[0];
        if(elementi[2]=="PM") {
            novoVrijeme=toString(parseInt(novoVrijeme)+12);
        }
        return novoVrijeme + ":" + elementi[1];
    }
    function ocistiKalendar(div) {
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }
    function isRegularnoRedovnoZauzece(element) {

        var result = element.dan >= 0;                             //filtriranje neregularnih parametara - periodicna
        result = result && (element.semestar == "zimski" || element.semestar == "ljetni");
        var vrijeme = element.pocetak;
        result = result && vrijeme.includes(":") && parseInt(vrijeme.substring(0, 2)) != undefined
            && parseInt(vrijeme.substring(3, 5)) != undefined;

        vrijeme = element.kraj;
        result = result && vrijeme.includes(":") && parseInt(vrijeme.substring(0, 2)) != undefined
            && parseInt(vrijeme.substring(3, 5)) != undefined;

        return result;
    }
    return {
        obojiZauzeca: obojiZauzecaImpl,
        ucitajPodatke: ucitajPodatkeImpl,
        iscrtajKalendar: iscrtajKalendarImpl,
        isRegularnoRedovnoZauzece: isRegularnoRedovnoZauzece
    }
}());
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"), new Date().getMonth());
    /*Kalendar.ucitajPodatke([ {dan:3,semestar:"zimski",pocetak:"13:00", kraj:"14:00",naziv:"1-15",predavac:"Dzejlan"}],
                             [ {datum:"22.11.2019", pocetak:"15:00", kraj:"16:00",naziv:"1-15", predavac:"Irfan"},
                             {datum:"20.10.2019", pocetak:"11:00", kraj:"14:00",naziv:"1-15", predavac:"Ivona"},
                             {datum:"10.12.2019", pocetak:"09:00", kraj:"11:00",naziv:"VA", predavac:"Šeila"} ]);*/
   // Kalendar.obojiZauzeca(document.getElementById("kalendar"),11,"1-15","12:00","13:30");