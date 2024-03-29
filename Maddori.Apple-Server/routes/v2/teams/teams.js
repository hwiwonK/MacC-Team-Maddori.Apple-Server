const {user, team, userteam, reflection, feedback} = require('../../../models');

// 팀 invitation_code 생성
// reference : https://www.programiz.com/javascript/examples/generate-random-strings
function generateCode() {
    let generatedCode = '';
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const codeLen = 6;
    for (let i = 0; i < codeLen; i++) {
        generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedCode;
}

// 팀 invitation_code 중복 여부 체크
function checkDuplicateCode(createdTeamCode) {
    const duplicateCode = team.findOne({
        where: {
            invitation_code: createdTeamCode
        }
    });
    if (duplicateCode == null) {
        // console.log("Code duplicate");
        return true;
    }
    return false;
}

// request data : user_id, team_name
// response data : team_id, team_name, team_code 
// 유저가 팀 생성하기 (팀의 코드 생성, 팀의 첫번째 회고 자동 생성)
async function createTeam(req, res, next) {
    const user_id = req.user_id;
    const { team_name, nickname, role } = req.body;

    try {
        // 생성된 팀 코드가 중복되지 않을 때까지 반복
        let createdTeamCode;
        do {
            createdTeamCode = generateCode();
        } while (checkDuplicateCode(createdTeamCode));

        // 팀 생성
        const createdTeam = await team.create({
            team_name: team_name,
            invitation_code: createdTeamCode
        });

        // 팀 생성 후 첫 번째 회고 생성
        const createdReflection = await reflection.create({
            team_id: createdTeam.id
        });

        // 현재 팀의 current_reflection_id 업데이트
        const updatedTeam = await team.update({
            current_reflection_id: createdReflection.id
        }, {
            where: {
                id: createdTeam.id
            }
        });

        // 프로필 이미지 저장된 경로 구하기
        const imagePath = req.file ? req.file.path.split('resources')[1] : null;

        // userteam 테이블 업데이트(팀 합류 및 프로필 생성)
        let createdUserteam = await userteam.create({
            user_id: user_id,
            team_id: createdTeam.id,
            nickname: nickname,
            role: role,
            profile_image_path: imagePath
        });

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
            message: '팀 생성 및 팀 합류 완료',
            detail: createdProfile
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '팀 생성 및 팀 합류 실패',
            detail: error.message
        });
    }
}

// request data : user_id, team_id
// response data : team_id, team_name, invitation_code
// 팀의 정보 가져오기
async function getCertainTeamDetail(req, res, next) {
    // console.log("팀의 정보 가져오기");

    try {
        const user_id = req.user_id;
        const { team_id } = req.params;

        // 팀의 team_id, team_name, invitation_code
        const teamInformation = await team.findByPk(team_id, {
            attributes: ['id', 'team_name', 'invitation_code']
        });        

        res.status(200).json({
            success: true,
            message: '유저가 속한 팀의 정보 가져오기 성공',
            detail: teamInformation
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '유저가 속한 팀의 정보 가져오기 실패',
            detail: error.message
        });
    }
}

/** request data : user_id, team_id
    response data : [user_id, nickname, role, profile_image_path]
    팀에 속한 유저(멤버) 목록 가져오기 **/
const getTeamMembers = async (req, res, next) => {
    // console.log("팀 멤버 목록 가져오기");
    const { team_id } = req.params;
    try {
        const user_id = req.user_id;
        // 멤버 목록 가져오기
        const teamMemberList = await userteam.findAll({
            attributes: [['user_id', 'id'], 'nickname', 'role', 'profile_image_path'],
            where: {
                team_id : team_id
            }  
        });
        // 일치하는 팀 정보가 없는 경우 에러 반환
        if (teamMemberList.length === 0) { throw Error('팀이 존재하지 않음'); }

        res.status(200).json({
            success: true,
            message: '팀의 멤버 목록 가져오기 성공',
            detail: {
                members : teamMemberList
            }
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '팀의 멤버 목록 가져오기 실패',
            detail: error.message
        });
    }
}

const editTeamName = async (req, res, next) => {
    const {team_id} = req.params;
    const {team_name} = req.body;

    try{
        // 팀 이름 수정
        await team.update({
            team_name: team_name
        }, {
            where: {
                id: team_id
            }
        });
        const editedTeam = await team.findByPk(team_id, {
            attributes: ['id', 'team_name']
        });

        res.status(200).json({
            success: true,
            message: '팀 이름 수정 성공',
            detail: editedTeam
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '팀 이름 수정 실패',
            detail: error.message
        });
    }
}

module.exports = {
    createTeam,
    getCertainTeamDetail,
    getTeamMembers,
    editTeamName
}