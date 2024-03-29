const {user, team, userteam, reflection, feedback} = require('../../../models');

// TODO : social login, token 생성 방식으로 변경
// request data : username
// response data : user_id, username
// 새로운 user 생성하기
async function userLogin(req, res, next) {
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

        res.status(201).json({
            success: true,
            message: '유저 닉네임 설정 성공',
            detail: {
                username: username
            }
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '유저 닉네임 설정 실패',
            detail: error.message
        });
    }
}

// request data : user_id, team_id
// response data : userteam_id, user_id, team_id, admin
// 유저가 팀에 합류하기
async function userJoinTeam(req, res, next) {
    // console.log("유저 팀 조인");
    const user_id = req.user_id;
    const { team_id } = req.params;

    try {
        // team 정보 유효한지 체크
        const requestTeam = await team.findByPk(team_id);
        if (requestTeam === null) throw Error('요청하는 팀이 존재하지 않음');

        // userteam 테이블에 저장할 유저의 이름 정보 찾기
        const requestUser = await user.findByPk(user_id);

        // userteam 테이블 업데이트
        let [createdUserteam, created] = await userteam.findOrCreate({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            defaults: {
                user_id: user_id,
                team_id: team_id,
                nickname: requestUser.username
            }
        });

        if (created === false) throw Error('이미 유저가 해당 팀에 합류된 상태');
        
        // v1.4 이후 새로 생성된 프로필 관련 필드는 반환하지 않음
        createdUserteam = createdUserteam.dataValues;
        delete createdUserteam.nickname;
        delete createdUserteam.role;
        delete createdUserteam.profile_picture;
        
        res.status(201).json({
            success: true,
            message: '유저 팀 합류 성공',
            detail: createdUserteam
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '유저 팀 합류 실패',
            detail: error.message
        });
    }
}

// request data : user_id, team_id
// response data : 결과 처리 여부
// 유저가 팀을 탈퇴하기
async function userLeaveTeam(req, res, next) {
    
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
            res.status(200).json({
                success: true,
                message: '유저 팀 탈퇴 성공'
            });
        } else { // 삭제할 데이터 없음
            res.status(400).json({
                success: false,
                message: '유저 팀 탈퇴 실패',
                detail: '유저와 팀 정보가 잘못됨'
            });
        }
    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '유저 팀 탈퇴 실패',
            detail: error.message
        });
    }
}

module.exports = {
    userLogin,
    userJoinTeam,
    userLeaveTeam
};