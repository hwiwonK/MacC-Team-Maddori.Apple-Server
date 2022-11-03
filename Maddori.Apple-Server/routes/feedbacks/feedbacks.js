const {user, team, userteam, reflection, feedback} = require('../../models');

// request data : user_id, team_id, reflection_id, feedback information(type, keyword, content, to_id, start_content)
// response data : feedback information(type, keyword, content, from_id, to_id, is_favorite, start_content, reflection_id) 
async function createFeedback(req, res, next) {
    console.log("피드백 생성하기");
    const feedbackContent = req.body;
    // TODO: 데이터 형식 맞지 않는 경우 에러 처리 추가
    // TODO: 받는 사람이 현재 팀에 없는 경우 에러 처리
    try {
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
        console.log(createdFeedback);
        res.status(201).json(createdFeedback);
    } catch(error) {
        // TODO: 에러 처리 수정
        res.status(500).json(error);
    }
}

module.exports = {
    createFeedback
};