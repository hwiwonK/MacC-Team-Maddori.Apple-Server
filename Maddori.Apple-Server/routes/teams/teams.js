const {user, team, userteam, reflection, feedback} = require('../../models');
const { validationResult } = require('express-validator');
const sc = require('../../constants/statusCode');
const m = require('../../constants/responseMessage');
const { success, fail } = require('../../constants/response');

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
const createTeam = async (req, res) => {
    const user_id = req.user_id;
    const teamContent = req.body;

    try {
        // 생성된 팀 코드가 중복되지 않을 때까지 반복
        let createdTeamCode;
        do {
            createdTeamCode = generateCode();
        } while (checkDuplicateCode(createdTeamCode));

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
            admin: true
        });
        
        res.status(sc.CREATED).send(success(m.CREATE_TEAM_SUCCESS_APPOINT_TEAM_LEADER, createTeam));

    } catch (error) {
        console.log(error);
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.CREATE_TEAM_FAIL));
    }
}

// request data : user_id, team_code
// response date : team_id, team_name
// 팀 코드를 통해 해당 팀의 이름을 찾는다. 일치하는 팀이 없을 경우 에러를 반환한다.
const getCertainTeamName = async (req, res) => {
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
            throw Error(m.INVALID_INVITATION_CODE);
        }
        res.status(sc.OK).send(success(sc.OK,m.GET_TEAM_INFO_SUCCESS, requestTeam));

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST.m.GET_TEAM_INFO_FAIL));
    }
} 

// request data : user_id, team_id
// response data : team_id, team_name, invitation_code, admin
// 팀의 정보 가져오기
const getCertainTeamDetail = async (req, res) => {
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
        res.status(sc.OK).send(success(sc.OK, m.GET_TEAM_INFO_SUCCESS, teamFinalInformation));


    } catch (error) {
        console.log(error);
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.GET_TEAM_INFO_FAIL));
    }
}

// request data : user_id, team_id
// response data : [user_id, username]
// 팀에 속한 유저(멤버) 목록 가져오기
const getTeamMembers = async (req, res) => {

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
        if (teamMemberList.length === 0) { throw Error('팀이 존재하지 않음'); }

        teamMemberList.map((data) => (delete data['user.username'], delete data['user.id']));
        const teamMemberInformation = {
            members: teamMemberList
        }
        res.status(sc.OK).send(success(sc.OK, m.GET_TEAM_MEMBER_LIST_SUCCESS, teamMemberInformation));


    } catch (error) {
        console.log(error);
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.GET_TEAM_MEMBER_LIST_FAIL));
    }
}

module.exports = {
    createTeam,
    getCertainTeamName,
    getCertainTeamDetail,
    getTeamMembers
};