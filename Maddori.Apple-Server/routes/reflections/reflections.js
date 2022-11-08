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
        console.log(keywordsList);
        
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

module.exports = {
    getCurrentReflectionDetail
};