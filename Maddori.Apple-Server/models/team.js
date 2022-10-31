'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class team extends Model {
        static associate(models) {
            models.team.hasMany(models.userteam, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            models.team.hasMany(models.feedback, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            models.team.hasMany(models.reflection, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            models.team.belongsTo(models.reflection, {
                foreignKey: {
                    name: 'current_reflection_id',
                    allowNull: false
                },
            }),
            models.team.belongsTo(models.reflection, {
                foreignKey: {
                    name: 'recent_reflection_id',
                    allowNull: true
                },
            })

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