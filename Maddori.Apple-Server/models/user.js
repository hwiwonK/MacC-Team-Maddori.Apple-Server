'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class user extends Model { 
        static associate(models) {
            models.user.hasMany(models.userteam, {
                foreignKey: {
                    name: 'user_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            })
            models.user.hasMany(models.css, {
                foreignKey: {
                    name: 'from_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            models.user.hasMany(models.css, {
                foreignKey: {
                    name: 'to_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            })
        }
    }

    user.init(
        {
            id: {
                field: "id",
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                field: "username",
                type: DataTypes.STRING(6),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "user",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            underscored: true
        }
    );
    return user;
}