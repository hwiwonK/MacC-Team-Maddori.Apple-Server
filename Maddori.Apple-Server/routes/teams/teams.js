const {user, team, userteam, reflection, feedback} = require('../../models');

// 팀 invitation_code 생성
// reference : https://www.programiz.com/javascript/examples/generate-random-strings
function generateCode() {
    let generatedCode = '';
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    const codeLen = 6;
    for (let i=0; i<codeLen; i++) {
        generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generatedCode;
}

// 팀 invitation_code 중복 여부 체크
function checkDuplicateCode(createdTeamCode) {
    const duplicateCode = team.findOne({
        where : {
            invitation_code: createdTeamCode
        }
    });
    if (duplicateCode == null) {
        console.log("Code duplicate");
        return true;
    }
    return false;
}

// request data : user_id, team_name
// response data : team_id, team_name, team_code 
// 유저가 팀 생성하기 (팀의 코드 생성, 해당 유저는 팀에 합류 후 팀의 admin으로 설정, 팀의 첫번째 회고 자동 생성)
async function createTeam(req, res) {
    console.log("팀 생성하기");
    const teamContent = req.body;
    // TODO: 데이터 형식 맞지 않는 경우 에러 처리 추가

    try {
        // 생성된 팀 코드가 중복되지 않을 때까지 반복
        let createdTeamCode;
        do {
            createdTeamCode = generateCode();
        } while (checkDuplicateCode(createdTeamCode))

        // 팀 생성
        const createdTeam = await team.create({
            team_name: teamContent.team_name,
            invitation_code: createdTeamCode
        });
        // 팀 생성 후 첫 번째 회고 생성
        const createdReflection = await reflection.create({
            team_id: createdTeam.id
        });
        // 유저의 팀 합류 및 리더 설정
        const createdUserTeam = await userteam.create({
            user_id: req.header('user_id'),
            team_id: createdTeam.id,
            admin: true
        });
        res.status(201).json(createdTeam);
    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(500).json(error);
    }
}

module.exports = {
    createTeam
};