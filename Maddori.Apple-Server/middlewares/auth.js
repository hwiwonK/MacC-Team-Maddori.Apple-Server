const { Op } = require('sequelize')
const jwtUtil = require('../utils/jwt.util');
const jwt = require('jsonwebtoken');
const {user, team, userteam, reflection, feedback, sequelize} = require('../models');
const secret = process.env.JWT_KEY;

// 유저 정보 검증하기
const userCheck = async (req, res, next) => {
    try {
        // console.log('유저 검증 시작');
        // accessToken 유효한지 검증, 유효하다면 user_id 값 가져오기
        const accessToken = req.header('access_token').replace(/"/g, ''); // 따옴표 제거
        let user_id;
        await jwtUtil.verify(accessToken).then((result) => {
            if (result.type === false) {
                console.log(result.message);
                throw Error('access_token이 유효하지 않음');
            }
            user_id = result.decoded.id;
        });

        // 다음 미들웨어 or 핸들러로 user_id 값 넘겨주기
        req.user_id = user_id;
        next();

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '유저 검증 실패',
            detail: error.message
        });
    }

}

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
                date: { [Op.lt]: new Date() }
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

const reflectionStateCheck = (requiredState) => {
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

            // 회고의 상태 구하기
            const reflectionState = await reflection.findOne({
                where: {
                    id: reflection_id,
                    team_id: team_id
                },
                raw: true
            });
            if (reflectionState.state !== requiredState && reflectionState.state != 'SettingRequired') throw Error(`현재 회고의 상태 ${reflectionState.state}에 요청을 수행할 수 없음`);
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
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck
}