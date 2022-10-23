'use strict';
const { Model } = require("sequelize");
// user 테이블 만들어서 User 객체로 저장하기

module.exports = function(sequelize, DataTypes){
    class reflection extends Model {
        
        static associate(models) {

        }
    }

    reflection.init(
        {
            id: {
                field: "id",
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            reflection_name: {
                field: "reflection_name",
                type: DataTypes.STRING(15),
                allowNull: false
            },
            date: {
                field: "date",
                type: DataTypes.DATE,
                allowNull: true
            },
            state: {
                field: "state",
                type: DataTypes.ENUM("SettingRequired", "Before", "Progressing", "Done"),
                allowNull: false,
                defaultValue: "SettingRequired"
            }
        }, {
            sequelize,
            modelName: "reflection",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            underscored: true
        }
    );
    return reflection;
}