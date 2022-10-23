'use strict';
const { Model } = require("sequelize");


// TODO: reflection 삭제 시 current_reflection_id가 연관된 team 삭제되지 않도록 수정
module.exports = function(sequelize, DataTypes){
    class reflection extends Model {
        
        static associate(models) {
            reflection.belongsTo(models.team, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            reflection.hasOne(models.team, {
                foreignKey: {
                    name: 'current_reflection_id',
                    allowNull: false
                },
            }),
            reflection.hasOne(models.team, {
                foreignKey: {
                    name: 'recent_reflection_id',
                    allowNull: true
                },
            })
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