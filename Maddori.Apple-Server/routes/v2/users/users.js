const {user, team, userteam, reflection, feedback} = require('../../../models');
// const multer = require('multer');
const fs = require("fs");

// request data : user_id, team_id
// response data : userteam_id, user_id, team_id
// 유저가 팀에 합류하기
async function userJoinTeam(req, res, next) {
    // console.log("유저 팀 조인");
    const user_id = req.user_id;
    const { team_id } = req.params;
    // const { nickname, role } = req.body;
    // console.log(req.file);
    try {
        // team 정보 유효한지 체크
        const requestTeam = await team.findByPk(team_id);
        if (requestTeam === null) throw Error('요청하는 팀이 존재하지 않음');

        // userteam 테이블 업데이트(팀 합류 및 프로필 생성)
        let [createdProfile, created] = await userteam.findOrCreate({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            defaults: {
                user_id: user_id,
                team_id: parseInt(team_id),
                nickname: nickname,
                role: role
            }
        });

        if (created === false) throw Error('이미 유저가 해당 팀에 합류된 상태');

        // // 프로필 생성
        // let createdProfile = await userteam.update({
        //     nickname: nickname,
        //     role: role
        // },{
        //     where: {
        //         user_id: user_id,
        //         team_id: team_id
        //     }
        // });
        
        // 프로필 사진 필드와 리더 정보 필드(v1.4 이후로 사용 안 함)는 반환하지 않음
        createdProfile = createdProfile.dataValues;
        delete createdProfile.admin;
        // delete createdProfile.profile_picture;
        
        res.status(201).json({
            success: true,
            message: '유저 팀 합류 및 프로필 생성 성공',
            detail: createdProfile
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '유저 팀 합류 및 프로필 생성 실패',
            detail: error.message
        });
    }
}

module.exports = {
    userJoinTeam
};