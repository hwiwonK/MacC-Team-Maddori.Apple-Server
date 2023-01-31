const {user, team, userteam, reflection, feedback} = require('../../../models');

// request data : user_id, team_id
// response data : userteam_id, user_id, team_id
// 유저가 팀에 합류하기
async function userJoinTeam(req, res, next) {
    // console.log("유저 팀 조인");
    const user_id = req.user_id;
    const { team_id } = req.params;
    const { nickname, role } = req.body;

    try {
        // team 정보 유효한지 체크
        const requestTeam = await team.findByPk(team_id);
        if (requestTeam === null) throw Error('요청하는 팀이 존재하지 않음');

        // 프로필 이미지 저장된 경로 구하기
        const imagePath = req.file ? req.file.path.split('resources')[1] : null;

        // userteam 테이블 업데이트(팀 합류 및 프로필 생성)
        let [createdUserteam, created] = await userteam.findOrCreate({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            defaults: {
                user_id: user_id,
                team_id: parseInt(team_id),
                nickname: nickname,
                role: role,
                profile_image_path: imagePath
            }
        });

        if (created === false) throw Error('이미 유저가 해당 팀에 합류된 상태');

        // v1.4 이후로 사용하지 않는 admin 필드는 반환하지 않음
        const createdProfile = await userteam.findByPk(createdUserteam.id, {
            attributes: ['id', 'nickname', 'role', 'profile_image_path', 'user_id'],
            include: [
                {
                    model: team, 
                    where: { id: createdUserteam.team_id },
                    attributes: ['id', 'team_name', 'invitation_code']
                }
            ]
        });
              
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