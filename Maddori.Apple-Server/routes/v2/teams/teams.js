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
    const teamContent = req.body;

    try {
        // 생성된 팀 코드가 중복되지 않을 때까지 반복
        let createdTeamCode;
        do {
            createdTeamCode = generateCode();
        } while (checkDuplicateCode(createdTeamCode));

        // userteam 테이블에 저장할 유저의 이름 정보 찾기
        const requestUser = await user.findByPk(user_id);

        // 팀 생성
        const createdTeam = await team.create({
            team_name: teamContent.team_name,
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

        // 유저의 팀 합류
        const createdUserTeam = await userteam.create({
            user_id: user_id,
            team_id: createdTeam.id,
            nickname: requestUser.username
        });
        
        res.status(201).json({
            success: true,
            message: '팀 생성 완료',
            detail: createdTeam
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '팀 생성 실패',
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

module.exports = {
    createTeam,
    getCertainTeamDetail
}