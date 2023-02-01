const {user, team, userteam, reflection, feedback, Sequelize } = require('../../../models');
const { Op } = require("sequelize");

// request data: team_id, reflection_id, type
// response data: id, type, keyword, content, from_user 정보 (id, nickname)
// 특정 회고에서 사용자가 받은 특정 type의 feedback 리스트를 불러온다
const getCertainTypeFeedbackAll = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { type } = req.query;
        const { team_id, reflection_id } = req.params;

        // 피드백을 보낸 사람의 정보 포함하여 피드백 조회
        const feedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                type: type,
                to_id: user_id,
            },
            include: [
                {
                    model: user,
                    attributes: [
                        'id',
                        [Sequelize.literal('nickname'), 'nickname'],
                    ],
                    as: 'from_user',
                    include: [
                        {
                            model: userteam,
                            attributes: []
                        }
                    ]
                }
            ],
            attributes: [
                'id', 'type', 'keyword', 'content'
            ]
        });

        return res.status(200).json({
            'success': true,
            'message': '피드백 정보 조회 성공',
            'detail': {
                'feedback': feedbackData
            }
        });
    } catch (error) {
        return res.status(400).json({
            'success': false,
            'message': '피드백 정보 조회 실패',
            'detail': error.message
        })
    }
}

module.exports = {
    getCertainTypeFeedbackAll
}