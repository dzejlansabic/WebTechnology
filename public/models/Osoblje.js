const Sequelize=require("sequelize");
const Model=Sequelize.Model;

module.exports = function(sequelize,DataTypes){

    class Osoblje extends Model {}
    Osoblje.init({    

        id: {
            type: Sequelize.INTEGER(11),
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
        },
        ime: Sequelize.STRING(30),
        prezime: Sequelize.STRING(30),
        uloga: Sequelize.STRING(50)

    }, {
        sequelize,
        modelName: 'Osoblje'
    });
    
return Osoblje;
};