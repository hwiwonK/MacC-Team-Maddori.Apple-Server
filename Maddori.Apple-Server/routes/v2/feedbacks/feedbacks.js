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
                'id', 'type', 'keyword', 'content', 'team_id', 'reflection_id'
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

/** request data: team_id, reflection_id, feedback_id, css_type, keyword, content
    response data: id, type, keyword, content, from_user 정보 (id, nickname), 
    team_id, reflection_id, reflection_name, 보내는 user_name
    특정 피드백을 수정하는 API, 현재 진행중인 회고는 수정이 불가능하다. **/
const updateFeedback = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { feedback_id } = req.params
        const { type, keyword, content} = req.body;

        // 피드백을 작성한 유저가 요청을 보낸 유저가 아닐 경우 에러 반환
        const checkFeedbackDataFromUser = await feedback.findByPk(feedback_id);
        if (checkFeedbackDataFromUser.from_id !== parseInt(user_id)) throw Error('타 유저가 작성한 피드백에 대한 수정 권한 없음');

        // 피드백 타입 오류에 대한 에러 반환
        if (!(type === 'Continue' || type === 'Stop')) {
            return res.status(400).json({
                'success': false,
                'message': '피드백의 타입정보 오류'
            })
        };

        // 피드백 업데이트 수행
        const updatedFeedbackData = await feedback.update({
            type: type,
            keyword: keyword,
            content: content,
        },{ 
            where: {
                id: feedback_id,
            },
        });

        const resultFeedbackData = await feedback.findByPk(feedback_id,
        {
            include: [
                {
                    model: user,
                    attributes: [
                        'id',
                        [Sequelize.literal('nickname'), 'nickname'],
                    ],
                    as: 'to_user',
                    include: [
                        {
                            model: userteam,
                            attributes: []
                        }
                    ]
                }
            ],
            attributes: [
                'id', 'type', 'keyword', 'content', 'team_id', 'reflection_id'
            ]
        });

        return res.status(200).json({
            'success': true,
            'message': '피드백 정보 수정 성공',
            'detail': resultFeedbackData
        });
        
    } catch (error) {
        return res.status(400).json({
            'success': false,
            'message': '피드백 정보 수정 실패',
            'detail': error.message
        });
    }
    
}

module.exports = {
    getCertainTypeFeedbackAll,
    updateFeedback
}