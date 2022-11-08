const {user, team, userteam, reflection, feedback} = require('../../models');

// request data : user_id, team_id
// response data : current_reflection_id, reflection_name, date, status, 회고에 속한 keywords 목록
// 팀에서 진행하는 현재의 회고 정보 가져오기
async function getCurrentReflectionDetail(req, res, next) {
    console.log("현재 회고 정보 가져오기");

    try {
        // 팀의 현재 회고 id
        const currentReflectionId = await team.findByPk(req.params.team_id, {
            attributes: ['current_reflection_id'],
            raw: true
        });

        // 팀의 현재 회고의 reflection_name, date, status
        const reflectionInformation = await reflection.findByPk(currentReflectionId.current_reflection_id);
        
        // 팀의 현재 회고에 속한 keywords
        const keywordsList = await feedback.findAll({
            attributes: ['keyword'],
            where: {
                reflection_id: currentReflectionId.current_reflection_id
            },
            raw : true
        });
        
        // 위 데이터 중 필요한 부분을 합친 response 데이터 만들기
        const reflectionFinalInformation = {
            current_reflection_id: currentReflectionId.current_reflection_id,
            reflection_name: reflectionInformation.reflection_name,
            reflection_date: reflectionInformation.date,
            reflection_status: reflectionInformation.state,
            reflection_keywords: keywordsList.map((data) => data.keyword)
        }

        res.status(200).json({
            success: true,
            message: '현재 회고 정보 가져오기 성공',
            detail: reflectionFinalInformation
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '현재 회고 정보 가져오기 실패',
            detail: error.message
        });
    }
}

// request data : user_id, team_id, reflection_id
// response data : reflection_id, reflection_name, date, status
// 팀의 리더가 팀의 현재 회고에 디테일 정보(이름, 일시)를 추가한다.
async function updateReflectionDetail(req, res, next) {
    console.log('회고 정보 추가하기');
    const { team_id, reflection_id } = req.params;
    const { reflection_name, reflection_date } = req.body;
    // TODO: 유저가 현재 팀의 리더인지 검증(미들웨어)
    // TODO: 회고의 status가 회고 정보를 추가할 수 있는 상태인지 검증(미들웨어)

    try {
        // 피드백 상세 정보 추가
        const updateReflectionSuccess = await reflection.update({
            reflection_name: reflection_name,
            date: reflection_date,
            state: 'Before'
        }, {
            where: {
                id: reflection_id,
            },
        });

        if (updateReflectionSuccess[0] === 0) throw Error('일치하는 회고 정보를 찾지 못함');

        const reflectionDetail = await reflection.findByPk(reflection_id);

        res.status(200).json({
            success: true,
            message: '회고 디테일 정보 추가 성공',
            detail: reflectionDetail
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '회고 디테일 정보 추가 실패',
            detail: error.message
        });
    }
}

//* 진행했던 회고목록 조회
//* request data: team_id
//* response data: id, reflection_name, date, state, team_id
const getPastReflectionList = async (req, res, next) => {
    const { team_id } = req.params;

    try {
        const reflectionData = await reflection.findAll({
            where: {
                team_id 
            }
        });
        return res.status(200).json({
            "success": true,
            "message": "data 조회 성공",
            "detail": {
                "reflection": [reflectionData]
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "회고목록 조회 실패",
            detail: error.message
        });
    }
}

module.exports = {
    getCurrentReflectionDetail,
    updateReflectionDetail,
    getPastReflectionList
};