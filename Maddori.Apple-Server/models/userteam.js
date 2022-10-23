'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class userteam extends Model {
        
        // static associate(models) {
        //     // define association here
        //     UserTeam.belongsTo(models.User, {
        //         foreignKey: 'user_id',
        //         onDelete: 'CASCADE'
        //     })
        // }
    }

    userteam.init(
        {
        id: {
            field: "id",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin: {
            field: "admin",
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        }, {
            sequelize,
            modelName: "userteam",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            underscored: true
        }
    );
    return userteam;
}
