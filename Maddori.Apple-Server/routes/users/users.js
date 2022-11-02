const {user, team, userteam, reflection, feedback} = require('../../models');

// TODO : social login, token 생성 방식으로 변경
// request data : username
// response data : user_id, username
// 새로운 user 생성하기
async function userLogin(req, res, next) {
    console.log("유저 로그인");
    console.log(req.body);
    const userContent = req.body;
    console.log(userContent);
    // TODO: username 데이터 없는 경우 에러 처리 추가

    try {
        const createdUser = await user.create(userContent);
        console.log(createdUser);
        res.status(201).send(createdUser);
        // TODO: response 과정 에러 처리 추가
    } catch(error) {
        // TODO: 에러 처리 수정
        res.status(500).send(error);
    }
}

// request data : user_id, invitation_code
// response data : userteam_id, user_id, team_id
// 유저가 팀에 합류하기
async function userJoinTeam(req, res, next) {
    console.log("유저 팀 조인");
    const userTeamContent = req.body;
    console.log(userTeamContent);
    // TODO: 데이터 형식 맞지 않는 경우 에러 처리 추가

    try {
        const requestTeam = await team.findOne({
            where : {
                invitation_code: userTeamContent.invitation_code
            },
            raw : true
        });
        // 초대 코드가 일치하는 팀이 없을 경우
        if (requestTeam == null) {
            console.log("team not found");
            // TODO: 초대 코드가 잘못 됐을 경우 에러 처리 추가
            // res.status(400).send({err_msg: "wrong invitation code"});
        }
        // 초대 코드가 일치하는 팀이 있는 경우, userteam 테이블 업데이트
        console.log(requestTeam);
        const createdUserteam = await userteam.create({
            user_id: req.header('user_id'),
            team_id: requestTeam.id
        });
        console.log(createdUserteam);
        res.status(201).send(createdUserteam);
        // TODO: response 과정 에러 처리 추가
    } catch(error) {
        // TODO: 에러 처리 수정
        res.status(500).send(error);
    }
}

// request data : user_id, team_id
// response data : 결과 처리 여부
// 유저가 팀을 탈퇴하기
async function userLeaveTeam(req, res, next) {
    console.log("유저 팀 탈퇴");
    
    try {
        const deletedUserTeam = await userteam.destroy({
            where : {
                user_id: req.header('user_id'),
                team_id: req.params.team_id
            }
        });
        // TODO: 삭제가 제대로 수행 안됐을 경우 에러 처리 추가
        // TODO: 삭제할 데이터가 없을 경우 에러 처리 수정
        console.log(deletedUserTeam);
        if (deletedUserTeam == 1) {
            res.status(200).send("success");
        } else {
            res.status(202).send("no such data");
        }
    } catch(error) {
        res.status(500).send(error);
    }
}

module.exports = {
    userLogin,
    userJoinTeam,
    userLeaveTeam
};