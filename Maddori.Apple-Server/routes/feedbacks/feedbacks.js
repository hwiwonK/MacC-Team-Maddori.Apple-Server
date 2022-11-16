const {user, team, reflection, feedback } = require('../../models');
const { Op } = require("sequelize");


// request data : user_id, team_id, reflection_id, feedback information(type, keyword, content, to_id, start_content)
// response data : feedback information(type, keyword, content, from_id, to_id, is_favorite, start_content)
// 회고에 새로운 피드백을 등록한다 
async function createFeedback(req, res, next) {
    // console.log("피드백 생성하기");
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
// response data: id, type, keyword, content, start_content, from_id, to_id, 
//team_id, reflection_id,reflection_name, 보내는 user_name
// 특정 type을 만족하는 feedback을 불러온다.
// 만약 reflection_id 가 recent인 경우에는 가장 최근 회고에서 feedback을 불러온다.
const getCertainTypeFeedbackAll = async (req, res, next) => {
    try {
        const { type } = req.query;
        const { team_id, reflection_id } = req.params;

        if (reflection_id == 'recent') {
            const teamData = await team.findByPk(team_id)
            const recentReflectionId = teamData.recent_reflection_id;
            const feedbackData = await feedback.findAll({
                where: {
                    team_id: team_id,
                    reflection_id: recentReflectionId,
                    type: type
                },
                include: [
                    {
                        model: reflection, where: { id: recentReflectionId }
                    },
                    {
                        model: user
                    }
                ]
            })  
            return res.status(200).json({
                'success': true,
                'message': '최근 회고 피드백 조회 성공',
                'detail': {
                    'feedback': [feedbackData]
                }
            });         
        }
        const feedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                type: type
            },
            include: [
                {
                    model: reflection, where: { id: recentReflectionId }
                },
                {
                    model: user
                }
            ]
        })
        return res.status(200).json({
            'success': true,
            'message': '피드백 정보 조회 성공',
            'detail': {
                'feedback': [feedbackData]
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

// request data :  user_id, team_id, 피드백을 받는 유저의 user_id
/* response data : user_id, team_id, reflection_id, 피드백을 받는 유저의 user_id, username, 
    피드백 type 별 feedback detail(keyword, content, start_content) */
// 팀의 현재 회고에 담긴 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기
const getFromMeToCertainMemberFeedbackAll = async (req, res) => {
    // console.log('특정 멤버에게 작성한 피드백 리스트 가져오기');

    try {
        const { reflection_id, team_id } = req.params;
        const { members } = req.query;
        const user_id = req.header('user_id');

        // 팀이 진행 중인 현재 회고 id 가져오기
        if (reflection_id !== 'current') throw Error('잘못된 요청 URI');
        const currentReflection = await team.findByPk(team_id, {
            attributes: ['current_reflection_id', 'reflection.reflection_name', 'reflection.state'],
            include: {
                model: reflection,
                as: 'reflection',
            },
            where: {
                current_reflection_id: reflection.id
            },
            raw: true
        });
        // console.log(currentReflection);

        // 피드백을 받는 멤버의 정보 가져오기 (받는 멤버의 정보가 없을 경우 에러 처리)
        const membersDetail = await user.findByPk(members);
        if (membersDetail === null) throw Error('받는 멤버의 정보를 찾을 수 없음');

        // 현재 회고의 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기
        const feedbacksToCertainMember = await feedback.findAll({
            attributes: ['type', 'keyword', 'content', 'start_content'],
            where: {
                reflection_id: currentReflection.current_reflection_id,
                from_id: user_id,
                to_id: members
            },
            raw: true
        });
        
        // type 기준으로 그룹화하여 묶기
        const feedbacksToCertainMemberGroupByType = {
            'team_id': team_id,
            'reflection_id': currentReflection.current_reflection_id,
            'reflection_name' : currentReflection.reflection_name,
            'reflection_status' : currentReflection.state,
            'from_id': user_id,
            'to_id': members,
            'to_username': membersDetail.username,
            'Continue': [],
            'Stop': []
        }
        feedbacksToCertainMember.map((data) => {
            const { type, ...contents } = data;
            // console.log(contents);
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

//* request data: team_id, reflection_id, feedback_id, css_type, keyword, content, start
//* response data: id, type, keyword, content, start_content, from_id, to_id, 
//* team_id, reflection_id, reflection_name, 보내는 user_name
//* 특정 피드백을 수정하는 API, 현재 진행중인 회고는 수정이 불가능하다.
const updateFeedback = async (req, res, next) => {
    try {
        const { feedback_id } = req.params
        const { type, keyword, content, start_content} = req.body;

        const updatedFeedbackData = await feedback.update(
            {
              type: type,
              keyword: keyword,
              content: content,
              start_content: start_content
            },
            { 
                where: {
                id: feedback_id
            }
        })

        const resultFeedbackData = await feedback.findByPk(feedback_id,
            {
                include: [{
                        model: reflection,
                    },
                    {
                        model: user
                    }]
            });

        return res.status(200).json({
            'success': true,
            'message': '피드백 정보 수정 성공',
            'detail': {
                'feedback': resultFeedbackData
            }})
        } catch (error) {
            return res.status(400).json({
                    'success': false,
                    'message': '피드백 정보 수정 실패',
                    'detail': error.message
                })
        }
    
}

//* request data: team_id, reflection_id, feedback_id
//* 특정 피드백을 삭제하는 API
const deleteFeedback = async (req, res, next) => {
    try {
        const { feedback_id } = req.params;

        const feedbackData = await feedback.destroy({
            where: {
                id: feedback_id
            }
        });
        return res.status(200).json({
            'success': true,
            'message': '피드백 정보 삭제 성공'
        })
    } catch (error) {
        return res.status(400).json({
            'success': false,
            'message': '피드백 정보 삭제 실패',
            'detail': error.message
        })
    }
}

//* request data: team_id, reflection_id
//* query string: members
//* reponse data: id, type, keyword, content, start_content, from_id, to_id, team_id, reflection_id
//* 회고의 특정 유저와 유저가 속한 팀의 피드백을 분류하여 조회하는 API
const getTeamAndUserFeedback = async (req, res) => {
    const user_id = req.header('user_id');

    try {
        const member_id = req.query.members;
        const { team_id, reflection_id } = req.params

        const userFeedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                to_id: member_id,
                from_id: user_id
            },
            include: {
                model: user,
                attributes: ['username'],
                required: true
            }
    });

    const teamFeedbackData = await feedback.findAll({
        where: {
            team_id: team_id,
            reflection_id: reflection_id,
            to_id: {
                [Op.ne]: member_id
            },
            from_id: user_id
        }
    })

    let category = "self";
    
    if (user_id !== member_id) { 
       category = "others";
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
    
};

module.exports = {
    createFeedback,
    getCertainTypeFeedbackAll,
    getFromMeToCertainMemberFeedbackAll,
    updateFeedback,
    deleteFeedback,
    getTeamAndUserFeedback
};