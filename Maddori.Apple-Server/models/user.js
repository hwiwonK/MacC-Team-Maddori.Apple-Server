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
            models.user.hasMany(models.feedback, {
                foreignKey: {
                    name: 'from_id',
                    allowNull: true
                },
                onDelete: 'SET NULL',
                hooks: true
            }),
            models.user.hasMany(models.feedback, {
                foreignKey: {
                    name: 'to_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            user.hasOne(models.usertoken, {
                foreignKey: {
                    name: 'user_id',
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
                allowNull: true
            },
            email: {
                field: "email",
                type: DataTypes.STRING,
                allowNull: true
            },
            sub: {
                field: "sub",
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: "user",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
            underscored: true
        }
    );
    return user;
}