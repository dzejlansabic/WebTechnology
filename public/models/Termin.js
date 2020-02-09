const Sequelize=require("sequelize");
const Model=Sequelize.Model;

module.exports = function(sequelize,DataTypes){

    class Termin extends Model {}
    Termin.init({    
        redovni: Sequelize.BOOLEAN,
        dan: { 
            type: Sequelize.INTEGER(1),
            allowNull:true
        },
        datum: {
            type: Sequelize.STRING(15),
            allowNull:true
        },
        semestar: Sequelize.STRING(10),
        pocetak: Sequelize.TIME,
        kraj: Sequelize.TIME

    }, {
        sequelize,
        modelName: 'Termin'
    });
    
return Termin;
};
