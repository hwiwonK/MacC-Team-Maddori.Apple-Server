const {user, team, userteam, reflection, feedback} = require('../../../models');
const { validationResult } = require('express-validator');

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
// 유저가 팀 생성하기 (팀의 코드 생성, 해당 유저는 팀에 합류 후 팀의 admin으로 설정, 팀의 첫번째 회고 자동 생성)
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

        // 유저의 팀 합류 및 리더 설정
        const createdUserTeam = await userteam.create({
            user_id: user_id,
            team_id: createdTeam.id,
            admin: true,
            nickname: requestUser.username
        });
        
        res.status(201).json({
            success: true,
            message: '팀 생성 완료, 유저를 해당 팀의 리더로 설정',
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

// request data : user_id, team_code
// response date : team_id, team_name
// 팀 코드를 통해 해당 팀의 이름을 찾는다. 일치하는 팀이 없을 경우 에러를 반환한다.
const getCertainTeamName = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { invitation_code } = req.query;
        const requestTeam = await team.findOne({
            attributes: ['id', 'team_name'],
            where: {
                invitation_code: invitation_code
            },
            raw: true
        });
        // 초대 코드가 일치하는 팀이 없을 경우
        if (requestTeam === null) {
            throw Error('초대 코드가 잘못됨');
        }
        res.status(200).json({
            success: true,
            message: '팀 정보 가져오기 성공',
            detail: requestTeam
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '팀 정보 가져오기 실패',
            detail: error.message
        });
    }
} 

// request data : user_id, team_id
// response data : team_id, team_name, invitation_code, admin
// 팀의 정보 가져오기
async function getCertainTeamDetail(req, res, next) {
    // console.log("팀의 정보 가져오기");

    try {
        const user_id = req.user_id;
        const { team_id } = req.params;

        // 팀의 team_name, invitation_code
        const teamBasicInformation = await team.findByPk(team_id);
        // 유저가 팀의 리더인지 확인
        const teamLeader = await userteam.findOne({
            where: {
                user_id: user_id,
                team_id: team_id
            },
            raw: true
        });

        // 위 데이터 중 필요한 부분을 합친 response 데이터 만들기
        const teamFinalInformation = {
            team_id: parseInt(team_id),
            team_name: teamBasicInformation.team_name,
            invitation_code: teamBasicInformation.invitation_code,
            admin: teamLeader.admin === 0 ? false : true
        }

        res.status(200).json({
            success: true,
            message: '유저가 속한 팀의 정보 가져오기 성공',
            detail: teamFinalInformation
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

// request data : user_id, team_id
// response data : [user_id, username]
// 팀에 속한 유저(멤버) 목록 가져오기
async function getTeamMembers(req, res, next) {
    // console.log("팀 멤버 목록 가져오기");

    try {
        const user_id = req.user_id;
        // 멤버 목록 가져오기
        const teamMemberList = await userteam.findAll({
            attributes: ['user.id', 'user.username'],
            where: {
                team_id: req.params.team_id
            },
            include: { 
                model: user,
                attributes: ['id', 'username'],
                required: true 
            },
            raw: true
        });
        // console.log(teamMemberList);
        if (teamMemberList.length === 0) { throw Error('팀이 존재하지 않음'); }

        teamMemberList.map((data) => (delete data['user.username'], delete data['user.id']));
        const teamMemberInformation = {
            members: teamMemberList
        }

        res.status(200).json({
            success: true,
            message: '팀의 멤버 목록 가져오기 성공',
            detail: teamMemberInformation
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

module.exports = {
    createTeam,
    getCertainTeamName,
    getCertainTeamDetail,
    getTeamMembers
};