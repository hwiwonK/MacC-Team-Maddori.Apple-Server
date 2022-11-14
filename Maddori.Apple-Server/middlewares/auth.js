const {user, team, userteam, reflection, feedback} = require('../models');

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

module.exports = {
    userTeamCheck,
    userAdminCheck
}