'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class usertoken extends Model { 
        static associate(models) {
            models.usertoken.belongsTo(models.user, {
                foreignKey: {
                    name: 'user_id',
                    allowNull: false,
                },
                onDelete: 'CASCADE',
                hooks: true
            })
        }
    }

    usertoken.init(
        {
            id: {
                field: "id",
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            refresh_token: {
                field: "refresh_token",
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "usertoken",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
            underscored: true
        }
    );
    return usertoken;
}