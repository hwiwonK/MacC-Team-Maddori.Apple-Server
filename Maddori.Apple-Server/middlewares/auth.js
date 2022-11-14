// const { NOW } = require('sequelize');
const { Op } = require('sequelize')
const {user, team, userteam, reflection, feedback, sequelize} = require('../models');

const userTeamCheck = async (req, res, next) => {
    try {
        console.log('유저의 팀 검증');
        const user_id = req.header('user_id');
        const { team_id, ...other } = req.params;

        // 요청을 보낸 유저가 요청 대상 팀(team_id)에 속해있는지 확인하기
        const findUserTeam = await userteam.findOne({
            where: {
                user_id: user_id,
                team_id: team_id
            }
        });
        if (findUserTeam === null) throw Error('유저가 요청 대상 팀에 속해있지 않음');
        next();

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '요청 권한 없음',
            detail: error.message
        });
    }
}

const userAdminCheck = async (req, res, next) => {
    try {
        console.log('유저의 현재 팀 리더 검증');
        const user_id = req.header('user_id');
        const { team_id, ...other } = req.params;

        // 요청을 보낸 유저가 요청 대상 팀(team_id)의 리더인지 확인하기
        const isLeader = await userteam.findOne({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            raw: true
        });
        if (isLeader.admin === 0) throw Error('유저가 요청 대상 팀의 리더가 아님');
        next();

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '요청 권한 없음',
            detail: error.message
        });
    }
}

const reflectionStateCheck = (requiredState) => {
    return async (req, res, next) => {
        try {
            console.log('회고의 상태 검증');
            const { team_id, reflection_id } = req.params;

            // 회고의 Before 상태를 요구한다면 회고 일정 지났는지 체크, 지났다면 상태 변경
            // const nowDate = new Date();
            // console.log(nowDate);
            if (requiredState === 'Before') {
                const updateReflectionState = await reflection.update({
                    state: 'Progressing'
                },{
                    where: {
                        id: reflection_id,
                        team_id: team_id,
                        date: { [Op.lt]: new Date() }
                    },
                    raw: true
                });
                // console.log(updateReflectionState);
            }

            // 회고의 상태 구하기
            const reflectionState = await reflection.findOne({
                where: {
                    id: reflection_id,
                    team_id: team_id
                },
                raw: true
            });
            // console.log(reflectionState.date);
            if (reflectionState.state !== requiredState) throw Error(`현재 회고의 상태 ${reflectionState.state}에 요청을 수행할 수 없음`);
            next();

        } catch (error) {
            res.status(400).json({
                success: false,
                message: '요청 권한 없음',
                detail: error.message
            });
        }
    }
}

module.exports = {
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
}