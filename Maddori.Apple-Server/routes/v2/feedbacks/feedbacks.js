const {user, team, userteam, reflection, feedback, Sequelize } = require('../../../models');
const { Op } = require("sequelize");

// request data : user_id, team_id, reflection_id, feedback information(type, keyword, content, to_id)
// response data : feedback information(id, type, keyword, content), 피드백을 받는 유저의 정보(id, nickname)
// 회고에 새로운 피드백을 등록한다 
const createFeedback = async (req, res, next) => {
    // console.log("피드백 생성하기");
    const feedbackContent = req.body;
    
    try {
        // 입력 받기
        const user_id = req.user_id;
        const { team_id, reflection_id } = req.params;
        const { type, keyword, content, to_id } = req.body;

        // 받는 user가 team에 속하는지 검증
        const toUserteam = await userteam.findOne({
            where: {
                user_id: to_id,
                team_id: team_id
            }
        });
        if (!toUserteam) throw Error('피드백을 받는 유저가 현재 팀에 속하지 않음');

        // 받는 user가 본인인지 검증
        if (user_id === to_id) throw Error('본인에게는 피드백을 작성할 수 없음');

        // type 검증
        if (!(type === 'Continue' || type === 'Stop')) {
            return res.status(400).json({
                'success': false,
                'message': '피드백의 타입정보 오류'
            });
        }

        // 피드백 등록, userteam 테이블 통해 피드백을 보낸 대상 유저의 nickname 가져오기
        const createdFeedback = await feedback.create({
            type: type,
            keyword: keyword,
            content: content,
            from_id: parseInt(user_id),
            to_id: parseInt(to_id),
            team_id: parseInt(team_id),
            reflection_id: parseInt(reflection_id)
        }).then(result => {
            return feedback.findByPk(result.id, {
                attributes: ['id', 'type', 'keyword', 'content'],
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
            });
        });

        res.status(201).json({
            success: true,
            message: '피드백 생성하기 성공',
            detail: createdFeedback
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '피드백 생성하기 실패',
            detail: error.message
        });
    }
}

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
                'id', 'type', 'keyword', 'content'
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

/** request data: team_id, reflection_id
    query string: members
    reponse data: id, type, keyword, content, team_id, reflection_id, from_user 정보 (id, nickname)
    회고의 특정 유저와 유저가 속한 팀의 피드백을 분류하여 조회하는 API **/
const getTeamAndUserFeedback = async (req, res) => {
    try {
        const user_id = req.user_id;
        const member_id = req.query.members;
        const { team_id, reflection_id } = req.params

        const memberTeam = await userteam.findOne({
            where: {
                user_id: member_id,
                team_id: team_id
            }
        });

        if (!memberTeam) throw Error('받는 멤버가 현재 팀에 속하지 않음');

        const userFeedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                to_id: member_id,
                from_id: user_id
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

        const teamFeedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                to_id: member_id,
                from_id: {
                    [Op.ne]: user_id
                }
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

        let category = 'self';
        
        if (user_id.toString() !== member_id.toString()) { 
            category = 'others';
        }
        
        return res.status(200).json({
            success: true,
            message: "피드백 조회 성공",
            detail: {
                category: category,
                user_feedback: userFeedbackData,
                team_feedback: teamFeedbackData 
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: true,
            message: "피드백 조회 실패",
            detail: error.message
        })
    }   
}

/** request data :  user_id, team_id, 피드백을 받는 유저의 user_id
    response data : reflection의 정보(id, reflection_name, date, state, team_id), 피드백을 받는 유저의 정보(user_id, nickname), 
    피드백 type 별 feedback detail(id, keyword, content)
    팀의 현재 회고에 담긴 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기 **/
const getFromMeToCertainMemberFeedbackAll = async (req, res) => {
    // console.log('특정 멤버에게 작성한 피드백 리스트 가져오기');
    try {
        const { reflection_id, team_id } = req.params;
        const { members } = req.query;
        const user_id = req.user_id;

        // 팀이 진행 중인 현재 회고 id 가져오기
        if (reflection_id !== 'current') throw Error('잘못된 요청 URI');
        const currentReflectionId = await team.findByPk(team_id, {
            attributes: ['current_reflection_id'],
            raw: true
        });
        // 현재 회고 정보 가져오기
        const currentReflection = await reflection.findByPk(currentReflectionId.current_reflection_id);

        // 받는 user가 team에 속하는지 검증, 받는 user의 정보(id, nickname) 가져오기
        const membersDetail = await userteam.findOne({
            attributes: ['id', 'nickname'],
            where: {
                user_id: members,
                team_id: team_id
            },
            raw: true
        });
        if (!membersDetail) throw Error('피드백을 받는 유저가 현재 팀에 속하지 않음');

        // 현재 회고의 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기
        const feedbacksToCertainMember = await feedback.findAll({
            attributes: ['id', 'type', 'keyword', 'content'],
            where: {
                reflection_id: currentReflectionId.current_reflection_id,
                from_id: user_id,
                to_id: members
            }
        });

        // response format
        const feedbacksToCertainMemberGroupByType = {
            'to_user': membersDetail,
            'reflection': currentReflection,
            'Continue': [],
            'Stop': []
        };

        // 피드백의 type에 따라 피드백 분류하기
        feedbacksToCertainMember.map((data) => {
            const { type, to_user, reflection, ...contents } = data.dataValues;
            feedbacksToCertainMemberGroupByType[type].push(contents);
        });

        res.status(200).json({
            success: true,
            message: '특정 멤버에게 작성한 피드백 목록 가져오기 성공',
            detail: feedbacksToCertainMemberGroupByType
        });

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(400).json({
            success: false,
            message: '특정 멤버에게 작성한 피드백 목록 가져오기 실패',
            detail: error.message
        });
    }
}

module.exports = {
    createFeedback,
    getCertainTypeFeedbackAll,
    updateFeedback,
    getTeamAndUserFeedback,
    getFromMeToCertainMemberFeedbackAll
}