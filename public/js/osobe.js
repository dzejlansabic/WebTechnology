
    var godina=new Date().getFullYear();//2020
    var mjesec=new Date().getMonth();//0 
    var dan=new Date().getDay();//3
    var datum=new Date().getDate();//22
        if(datum<10) datum="0"+new Date().getDate();
    var sati=new Date().getHours();//20
        if(sati<10) sati="0" + new Date().getHours();
    var minute=new Date().getMinutes();//44

    var trenutniDatum = datum + "/" + mjesec+1 + "/" + godina;
    var trenutnoVrijeme = sati + ":" + minute + ":00";
    var listaTermina=[];
    var listaOsobe=[];
    var listaSala=[];
function vratiOsobeSale() { 
    let ajaxZahtjev = new XMLHttpRequest();
    ajaxZahtjev.open('GET', 'http://localhost:8080/vratiOsobeMjesto', true);
    ajaxZahtjev.send();
    ajaxZahtjev.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let lista = JSON.parse(ajaxZahtjev.responseText);
                for(var i=0; i<Object.keys(lista.termini).length; i++) {
                    console.log(lista.termini[i].datum);
                    console.log(trenutniDatum);
                    console.log(lista.termini[i].pocetak);
                    console.log(trenutnoVrijeme);
                    console.log(lista.termini[i].pocetak<=trenutnoVrijeme);
                    
                    if(lista.termini[i].redovni==false && lista.termini[i].datum==trenutniDatum && lista.termini[i].pocetak<=trenutnoVrijeme && trenutnoVrijeme<lista.termini[i].kraj) {
                        listaTermina.push(lista.termini[i].id);
                    }
                    else if(lista.termini[i].redovni==true && lista.termini[i].dan==dan-1 && lista.termini[i].pocetak<=trenutnoVrijeme && trenutnoVrijeme<lista.termini[i].kraj) {
                        listaTermina.push(lista.termini[i].id);
                    }
                }
                for(var i=0; i<Object.keys(lista.rezervacije).length; i++) {
                    for(var j=0; j<Object.keys(listaTermina).length; j++) {

                        if(lista.rezervacije[i].termin == listaTermina[j]) {
                            listaOsobe.push(lista.rezervacije[i].osoba);
                            listaSala.push(lista.rezervacije[i].sala);
                        }
                    }
                }
                for (var i=0; i<Object.keys(lista.osoblje).length; i++) {
                    console.log("USAOOOOOO 5");

                    //kreiranje elemenata i ubacivanje
                    var listaO = document.getElementById('listaOsoblja');
                    var listaS = document.getElementById('listaSala');

                    var imeO = document.createElement('li');
                    var nazivS=document.createElement('li');

                    for (var j=0; j<Object.keys(listaOsobe).length; j++) {

                        if(lista.osoblje[i].id==listaOsobe[j]) {
                            imeO.appendChild(document.createTextNode(lista.osoblje[i].ime));
                            listaO.appendChild(imeO);
                            nazivS.appendChild(document.createTextNode(lista.sale[i].naziv));
                            listaS.appendChild(nazivS);
                        }
                        else {
                            imeO.appendChild(document.createTextNode(lista.osoblje[i].ime));
                            listaO.appendChild(imeO);
                            nazivS.appendChild(document.createTextNode("U kancelariji"));
                            listaS.appendChild(nazivS);
                        }
                    }
                    if(Object.keys(listaOsobe).length==0) {
                            imeO.appendChild(document.createTextNode(lista.osoblje[i].ime));
                            listaO.appendChild(imeO);
                            nazivS.appendChild(document.createTextNode("U kancelariji"));
                            listaS.appendChild(nazivS);
                    }
                }
        };
    }
}
vratiOsobeSale();
    setInterval(vratiOsobeSale, 30000);