'use strict';
const { Model, BLOB } = require("sequelize");

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
            nickname: {
                field: "nickname",
                type: DataTypes.STRING(6),
                allowNull: false
            },
            role: {
                field: "role",
                type: DataTypes.STRING(20),
                allowNull: true
            },
            profile_picture: {
                field: "profile_picture",
                type: BLOB('medium'),
                allowNull: true
            }
        }, {
            sequelize,
            modelName: "userteam",
            timestamps: false,
            freezeTableName: true,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
            underscored: true
        }
    );
    return userteam;
}
