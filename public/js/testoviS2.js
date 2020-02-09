let assert = chai.assert;
describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
    it('should have 30 days when parameter are kalendarRef, 10', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);
        let dani1=32 - new Date(new Date().getFullYear(), new Date().getMonth(), 32).getDate();
        assert.equal(dani1, 30 ,"Broj dana treba biti 30");
   });
    it('should have 31 days when parameter are kalendarRef, 11', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);
        let dani=32 - new Date(new Date().getFullYear(), 11, 32).getDate();
        assert.equal(dani, 31 ,"Broj dana treba biti 31");
    });
    it('first day should be friday', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),new Date().getMonth);
        let prviDan = new Date(new Date().getFullYear(),new Date().getMonth()).getDay();
        assert.equal(prviDan-1, 4 ,"Prvi dan mjeseca treba biti petak");
    });
    it('30. day should be saturday', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);
        let dan=new Date(new Date().getFullYear(), 10, 30).getDay();        
        assert.equal(dan, 6 ,"30. dan mjeseca treba biti subota");
    });
    
    it('should have 31 days and first day should be tuesday', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),9);
        let dani=32 - new Date(new Date().getFullYear(), 9, 32).getDate();        
        let prviDan = new Date(2019,9).getDay();
        assert.equal(prviDan-1, 1 ,"Prvi dan mjeseca treba biti utorak");
        assert.equal(dani, 31 ,"Mjesec bi trebao imati 31 dan");
    });
    it('should have 28 days when parameter are kalendarRef, 1', function() {
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"),1);
        let dani=32 - new Date(new Date().getFullYear(), 1, 32).getDate();
        assert.equal(dani, 28 ,"Broj dana treba biti 28");
    });

/*it('should draw 2 columns in row 2 when parameter are 2,3', function() {
       Tabela.crtaj(2,3);
       let tabele = document.getElementsByTagName("table");
       let tabela = tabele[tabele.length-1]
       let redovi = tabela.getElementsByTagName("tr");
       let kolone = redovi[2].getElementsByTagName("td");
       let brojPrikazanih = 0;
       for(let i=0;i<kolone.length;i++){
           let stil = window.getComputedStyle(kolone[i])
           if(stil.display!=='none') brojPrikazanih++;
       }
       assert.equal(brojPrikazanih, 2,"Broj kolona treba biti 2");
     });*/
 });

    describe('obojiZauzeca()', function() {
        it('ne treba obojiti nista', function() {
            Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);
            let dani=32 - new Date(new Date().getFullYear(), 10, 32).getDate();
            Kalendar.obojiZauzeca(document.getElementById("kalendar"),11,"1-15","12:00","13:30");
            var datumi=document.getElementById("kalendar").getElementsByClassName("pojedinacanDatum");
            var obojani=0;
            for(var i=1; i<=dani; i++) {
                if(datumi[i].style.borderBottom=="red solid 20px")
                    obojani++;
            }
            assert.equal(obojani, 0 ,"Broj obojanih dana treba biti 0");
        });
    });
});
