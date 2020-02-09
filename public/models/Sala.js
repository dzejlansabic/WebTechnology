const Sequelize=require("sequelize");
const Model=Sequelize.Model;

module.exports = function(sequelize,DataTypes){

    class Sala extends Model {}
    Sala.init({    

        naziv: Sequelize.STRING(30),

    }, {
        sequelize,
        modelName: 'Sala'
    });
    
return Sala;
};
