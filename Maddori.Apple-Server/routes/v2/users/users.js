const {user, team, userteam, reflection, feedback} = require('../../../models');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
__basedir = path.resolve();

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

const editProfile = async (req, res) => {
    
    const user_id = req.user_id;
    const { team_id } = req.params;
    const { nickname, role } = req.body;

    try {
        // 기존 이미지 삭제 - 이미지 존재하는 경우에만
        const { profile_image_path } = await userteam.findOne({
            attributes: ['profile_image_path'],
            where: {
                user_id: user_id,
                team_id: team_id
            },
            raw: true
        })

        // 기존 이미지 파일이 서버에 존재한다면 삭제
        const fullImagePath = __basedir + '/resources' + profile_image_path;
        const changedImagePath = req.file ? req.file.path.split('resources')[1] : profile_image_path;
        // 기존 이미지 파일 삭제 실패한 경우 에러 반환, 기존 이미지 파일이 존재하지 않을 경우는 그대로 진행

        // 이미지 변경 있을 경우
        if (changedImagePath != profile_image_path) {
            try {
                fs.unlinkSync(fullImagePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    fs.unlikeSync(changedImagePath);
                    return res.status(500).json({
                        success: false,
                        message: '유저 프로필 수정 실패',
                        detail: '서버 오류'
                    })
                }
            }
            
        }

        // 프로필 정보(닉네임, 역할) 업데이트
        const userProfile = await userteam.findOne({
            where: {
                user_id: user_id,
                team_id: team_id
            }
        });
        userProfile.set({
            nickname: nickname,
            role: role
        });

        // 이미지 변경 있는 경우 이미지 정보 업데이트
        userProfile.set({
            profile_image_path: changedImagePath
        });

        // 프로필 수정 사항 반영
        await userProfile.save();

        // 수정된 프로필 조회 후 response
        const editedProfile = await userteam.findOne({
            attributes: [['user_id', 'id'], 'nickname', 'role', 'profile_image_path'],
            where: {
                user_id: user_id,
                team_id: team_id
            }
        });

        res.status(201).json({
            success: true,
            message: '유저 프로필 수정 성공',
            detail: editedProfile
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '유저 프로필 수정 실패',
            detail: error.message
        });
    }
}

const getUserTeamList = async (req, res) => {
    
    const user_id = req.user_id;
    
    try {
        // 유저가 속한 팀의 id와 팀 name 가져오기
        const userTeamList = await userteam.findAll({
            attributes: [['team_id', 'id'], [Sequelize.literal('team_name'), 'team_name'], 'nickname'],
            where: {
                user_id: user_id
            },
            include: {
                attributes: [],
                model: team
            }
        });

        res.status(200).json({
            success: true,
            message: '유저의 팀 목록 가져오기 성공',
            detail: userTeamList
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '유저의 팀 목록 가져오기 실패',
            detail: error.message
        });
    }
}

module.exports = {
    userJoinTeam,
    editProfile,
    getUserTeamList
};