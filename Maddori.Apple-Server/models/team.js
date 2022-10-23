'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class team extends Model {
        
        static associate(models) {

        }
    }

    team.init(
        {
            id: {
                field: "id",
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            team_name: {
                field: "team_name",
                type: DataTypes.STRING(10),
                allowNull: false
            },
            invitation_code: {
                field: "invitation_code",
                type: DataTypes.STRING(6),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "team",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            underscored: true
        }
    );
    return team;
}