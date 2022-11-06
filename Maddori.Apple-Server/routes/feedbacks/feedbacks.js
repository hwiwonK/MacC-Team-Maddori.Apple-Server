const {user, team, userteam, reflection, feedback} = require('../../models');

// request data : user_id, team_id, reflection_id, feedback information(type, keyword, content, to_id, start_content)
// response data : feedback information(type, keyword, content, from_id, to_id, is_favorite, start_content)
// 회고에 새로운 피드백을 등록한다 
async function createFeedback(req, res, next) {
    console.log("피드백 생성하기");
    const feedbackContent = req.body;
    // TODO: 데이터 형식 맞지 않는 경우 에러 처리 추가
    // TODO: 받는 사람이 현재 팀에 없는 경우 에러 처리
    
    try {
        // 피드백 등록
        const createdFeedback = await feedback.create({
            type: feedbackContent.type,
            keyword: feedbackContent.keyword,
            content: feedbackContent.content,
            start_content: feedbackContent.start_content,
            from_id: req.header('user_id'),
            to_id: feedbackContent.to_id,
            team_id: req.params.team_id,
            reflection_id: req.params.reflection_id
        });
        res.status(201).json(createdFeedback);
    } catch(error) {
        // TODO: 에러 처리 수정
        res.status(400).json(error);
    }
}

// request data: team_id, reflection_id
// query string: type
// reponse data: id, type, keyword, content, start_content, from_id, to_id, team_id, reflection_id
// 특정 type을 만족하는 feedback을 불러온다.
const getCertainTypeFeedbackAll = async (req, res) => {
    try {
        const { type } = req.query;
        const { team_id, reflection_id } = req.params;

        const feedbackData = await feedback.findAll({
            where: {
                type: type,
                team_id: team_id,
                reflection_id: reflection_id
            }
        })
        return res.status(200).json({'success':true, 'message':'조회 성공','detail':feedbackData});
    } catch (error) {
        console.log(error);
        return res.status(400).json({"success":false, "message":"조회 실패"})
    }
}

module.exports = {
    createFeedback,
    getCertainTypeFeedbackAll
};