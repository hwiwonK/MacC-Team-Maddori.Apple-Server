// const { NOW } = require('sequelize');
const { Op } = require('sequelize')
const {user, team, userteam, reflection, feedback, sequelize} = require('../models');

const userTeamCheck = async (req, res, next) => {
    try {
        // console.log('유저의 팀 검증');
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
        // console.log('유저의 현재 팀 리더 검증');
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

const reflectionTimeCheck = async (req, res, next) => {
    try {
        // console.log('회고 일정 체크');
        let { team_id, reflection_id } = req.params;

        // 팀에서 진행 중인 현재 회고의 reflection_id 구하기
        if (reflection_id === undefined || reflection_id === 'current') {
            const currentReflectionId = await team.findByPk(team_id, {
                attributes: ['current_reflection_id'],
                raw: true
            });
            reflection_id = currentReflectionId.current_reflection_id;
        }

        // 회고 일정이 지났다면 회고 state update
        const updateReflectionState = await reflection.update({
            state: 'Progressing'
        },{
            where: {
                id: reflection_id,
                team_id: team_id,
                date: { [Op.lt]: new Date() },
                state: { [Op.ne]: 'Done'}
            },
            raw: true
        });
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: '서버 에러 발생',
            detail: error.message
        });
    }
}

const reflectionStateCheck = (requiredStateFirst, requiredStateSecond) => {
    return async (req, res, next) => {
        try {
            // console.log('회고의 상태 검증');
            let { team_id, reflection_id } = req.params;

            // 팀에서 진행 중인 현재 회고의 reflection_id 구하기
            if (reflection_id === undefined || reflection_id === 'current') {
                const currentReflectionId = await team.findByPk(team_id, {
                    attributes: ['current_reflection_id'],
                    raw: true
                });
                reflection_id = currentReflectionId.current_reflection_id;
            }

            // reflection_id가 recent일 경우 검증 pass
            if (reflection_id === 'recent') {
                next();
                return;
            }

            // 회고의 상태 구하기
            const reflectionState = await reflection.findOne({
                where: {
                    id: reflection_id,
                    team_id: team_id
                },
                raw: true
            });

            // 목표 상태가 한 개일 때, 두 개일 때 나눠서 처리
            if (requiredStateSecond === undefined){
                if (reflectionState.state !== requiredStateFirst) throw Error(`현재 회고의 상태 ${reflectionState.state}에 요청을 수행할 수 없음`);
            } else {
                if (reflectionState.state !== requiredStateFirst && reflectionState.state !== requiredStateSecond) throw Error(`현재 회고의 상태 ${reflectionState.state}에 요청을 수행할 수 없음`);
            }
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
    reflectionTimeCheck,
    reflectionStateCheck
}