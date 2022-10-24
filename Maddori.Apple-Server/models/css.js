'use strict';
const { Model } = require("sequelize");

module.exports = function(sequelize, DataTypes){
    class css extends Model {
        
        static associate(models) {
            css.belongsTo(models.user, {
                foreignKey: {
                    name: 'from_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            css.belongsTo(models.user, {
                foreignKey: {
                    name: 'to_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            css.belongsTo(models.team, {
                foreignKey: {
                    name: 'team_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            }),
            css.belongsTo(models.reflection, {
                foreignKey: {
                    name: 'reflection_id',
                    allowNull: false
                },
                onDelete: 'CASCADE',
                hooks: true
            })
        }
    }

    css.init(
        {
            id: {
                field: "id",
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type: {
                field: "type",
                type: DataTypes.ENUM("Continue", "Stop"),
                allowNull: false,
                defaultValue: "Continue"
            },
            keyword: {
                field: "keyword",
                type: DataTypes.STRING(15),
                allowNull: false
            },
            content: {
                field: "content",
                type: DataTypes.STRING(200),
                allowNull: true
            },
            is_favorite: {
                field: "is_favorite",
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            start_content: {
                field: "start_content",
                type: DataTypes.STRING(200),
                allowNull: true
            }
        }, {
            sequelize,
            modelName: "css",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            underscored: true
        }
    );
    return css;
}