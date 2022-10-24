'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class userteam extends Model {
        static associate(models) {
            userteam.belongsTo(models.user, {
                foreignKey: {
                    name: 'user_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            userteam.belongsTo(models.team, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            })
        }
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
