const {user, team, userteam, reflection, feedback} = require('../../models');
const sc = require('../../constants/statusCode');
const m = require('../../constants/responseMessage');
const { success, fail } = require('../../constants/response');

// TODO : social login, token 생성 방식으로 변경
// request data : username
// response data : user_id, username
// 새로운 user 생성하기
const userLogin = async (req, res) => {
    // console.log("유저 로그인");
    const user_id = req.user_id;
    const { username } = req.body;

    try {
        const updatedUser = await user.update({
            username: username,
        },{
            where: {
                id: user_id
            }
        });

        res.status(sc.CREATED).json({
            success: true,
            message: m.SET_USER_NICKNAME_SUCCESS,
            detail: {
                username: username
            }
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(sc.BAD_REQUEST).json({
            success: false,
            message: m.SET_USER_NICKNAME_FAIL,
            detail: error.message
        });
    }
}

// request data : user_id, team_id
// response data : userteam_id, user_id, team_id
// 유저가 팀에 합류하기
const userJoinTeam = async (req, res) => {
    // console.log("유저 팀 조인");
    const user_id = req.user_id;
    const { team_id } = req.params;

    try {
        // team 정보 유효한지 체크
        const requestTeam = await team.findByPk(team_id);
        if (requestTeam === null) throw Error('요청하는 팀이 존재하지 않음');

        // userteam 테이블 업데이트
        const [createdUserteam, created] = await userteam.findOrCreate({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            defaults: {
                user_id: user_id,
                team_id: team_id
            }
        });

        if (created === false) throw Error('이미 유저가 해당 팀에 합류된 상태');
        res.status(sc.CREATED).send(success(sc.CREATED, m.JOIN_TEAM_SUCCESS, createdUserteam));
    } catch (error) {
        console.log(error);
        res.status(sc.BAD_REQUEST).send(success(sc.BAD_REQUEST, m.JOIN_TEAM_FAIL));
    }
}

// request data : user_id, team_id
// response data : 결과 처리 여부
// 유저가 팀을 탈퇴하기
const userLeaveTeam = async (req, res) => {
    
    try {
        const user_id = req.user_id;
        const { team_id } = req.params;
        const deletedUserTeam = await userteam.destroy({
            where : {
                user_id: user_id,
                team_id: team_id
            }
        });
        
        if (deletedUserTeam === 1) { // 삭제할 데이터 있음
            res.status(sc.OK).send(success(sc.OK, m.WITHDRAW_TEAM_SUCCESS));
        } else { // 삭제할 데이터 없음
            res.status(sc.OK).send(fail(sc.BAD_REQUEST, m.WITHDRAW_TEAM_FAIL));
        }
    } catch (error) {
        console.log(error)
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.WITHDRAW_TEAM_FAIL));
    }
}

module.exports = {
    userLogin,
    userJoinTeam,
    userLeaveTeam
};