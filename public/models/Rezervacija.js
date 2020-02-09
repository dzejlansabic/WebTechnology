const Sequelize=require("sequelize");
const Model=Sequelize.Model;

module.exports = function(sequelize,DataTypes){

    class Rezervacija extends Model {}
    Rezervacija.init({
        

    }, {
        sequelize,
        modelName: 'Rezervacija'
    });
    
return Rezervacija;
};