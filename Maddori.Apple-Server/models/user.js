'use strict';
const { Model } = require("sequelize");
// user 테이블 만들어서 User 객체로 저장하기

module.exports = function(sequelize, DataTypes){
    class user extends Model {
        
        static associate(models) {
            // define association here
            // models.user.hasMany(models.userteam, {
            //     onDelete: 'CASCADE'
            // });
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