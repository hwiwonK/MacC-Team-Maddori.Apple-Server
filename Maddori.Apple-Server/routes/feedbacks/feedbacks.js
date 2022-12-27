const {user, team, userteam, reflection, feedback } = require('../../models');
const { Op } = require("sequelize");
const sc = require('../../constants/statusCode');
const m = require('../../constants/responseMessage');
const { success, fail } = require('../../constants/response');

// request data : user_id, team_id, reflection_id, feedback information(type, keyword, content, to_id)
// response data : feedback information(type, keyword, content, from_id, to_id, is_favorite)
// 회고에 새로운 피드백을 등록한다 
const createFeedback = async (req, res) => {
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
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST,m.FEEDBACK_TYPE_ERROR))
        }

        // 피드백 등록
        const createdFeedback = await feedback.create({
            type: type,
            keyword: keyword,
            content: content,
            from_id: parseInt(user_id),
            to_id: parseInt(to_id),
            team_id: parseInt(team_id),
            reflection_id: parseInt(reflection_id)
        });
        res.status(sc.CREATED).send(success(sc.CREATED, m.CREATE_FEEDBACK_SUCCESS, createdFeedback));

    } catch (error) {
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.CREATE_FEEDBACK_FAIL));
    }
}


// request data: team_id, reflection_id, type
// response data: id, type, keyword, content, from_id, to_id, 
//team_id, reflection_id,reflection_name, 보내는 user_name
// 특정 type을 만족하는 feedback을 불러온다.
// 만약 reflection_id 가 recent인 경우에는 가장 최근 회고에서 feedback을 불러온다.
const getCertainTypeFeedbackAll = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { type } = req.query;
        const { team_id, reflection_id } = req.params;

        if (reflection_id === 'recent') {
            const teamData = await team.findByPk(team_id)
            const recentReflectionId = teamData.recent_reflection_id;
            if (!recentReflectionId) throw Error('최근 회고가 존재하지 않습니다');

            const feedbackData = await feedback.findAll({
                where: {
                    team_id: team_id,
                    reflection_id: recentReflectionId,
                    type: type,
                    to_id: user_id
                },
                include: [
                    {
                        model: reflection, where: { id: recentReflectionId }
                    },
                    {
                        model: user,
                        attributes: ['id', 'username'],
                        as: 'from_user'
                    }
                ]
            }) 
            return res.status(sc.OK).send(success(sc.OK, m.GET_RECENT_FEEDBACK_SUCCESS, {'feedback': feedbackData}));
        }
        const feedbackData = await feedback.findAll({
            where: {
                team_id: team_id,
                reflection_id: reflection_id,
                type: type,
                to_id: user_id
            },
            include: [
                {
                    model: reflection, where: { id: reflection_id }
                },
                {
                    model: user,
                    attributes: ['id', 'username'],
                    as: 'from_user'
                }
            ]
        })
        return res.status(sc.OK).send(success(sc.OK, m.CREATE_FEEDBACK_SUCCESS, {'feedback':feedbackData}));
    } catch (error) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.GET_FEEDBACK_FAIL));
    }
}

// request data :  user_id, team_id, 피드백을 받는 유저의 user_id
/* response data : user_id, team_id, reflection_id, 피드백을 받는 유저의 user_id, username, 
    피드백 type 별 feedback detail(keyword, content) */
// 팀의 현재 회고에 담긴 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기
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

        // 받는 user가 team에 속하는지 검증
        const membersDetail = await userteam.findOne({
            attributes: ['id', 'user.username'],
            where: {
                user_id: members,
                team_id: team_id
            },
            include: {
                model: user,
            },
            raw: true
        });
        if (!membersDetail) throw Error(m.NOT_INCLUDED_USER);

        // 현재 회고의 피드백 중 유저가 특정 멤버에게 작성한 피드백 정보 가져오기
        const feedbacksToCertainMember = await feedback.findAll({
            attributes: ['id','type', 'keyword', 'content'],
            where: {
                reflection_id: currentReflection.id,
                from_id: user_id,
                to_id: members
            },
            raw: true
        });

        // type 기준으로 그룹화하여 묶기
        const feedbacksToCertainMemberGroupByType = {
            'team_id': parseInt(team_id),
            'reflection_id': currentReflection.id,
            'reflection_name' : currentReflection.reflection_name,
            'reflection_status' : currentReflection.state,
            'from_id': parseInt(user_id),
            'to_id': parseInt(members),
            'to_username': membersDetail.username,
            'Continue': [],
            'Stop': []
        }
        feedbacksToCertainMember.map((data) => {
            const { type, ...contents } = data;
            feedbacksToCertainMemberGroupByType[type].push(contents);
        });
        res.status(sc.OK).send(success(sc.OK, m.GET_FEEDBACK_LIST_TO_SPECIFIC_MEMBER_SUCCESS, feedbacksToCertainMemberGroupByType));

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.GET_FEEDBACK_LIST_TO_SPECIFIC_MEMBER_FAIL));
    }
}

//* request data: team_id, reflection_id, feedback_id, css_type, keyword, content
//* response data: id, type, keyword, content, from_id, to_id, 
//* team_id, reflection_id, reflection_name, 보내는 user_name
//* 특정 피드백을 수정하는 API, 현재 진행중인 회고는 수정이 불가능하다.
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
            return res.status(sc.BAD_REQUEST).json({
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
            include: [{
                    model: reflection,
                },
                {
                    model: user,
                    attributes: ['id', 'username'],
                    as: 'to_user'
                }]
        });
        return res.status(sc.OK).send(success(sc.OK, m.UPDATE_FEEDBACK_SUCCESS, {'feedback':resultFeedbackData}))
        } catch (error) {
            return res.status(sc.BAD_REQUEST).send(sc.BAD_REQUEST, m.UPDATE_FEEDBACK_FAIL);
        }
    
}

//* request data: team_id, reflection_id, feedback_id
//* 특정 피드백을 삭제하는 API
const deleteFeedback = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { feedback_id } = req.params;

        // 피드백을 작성한 유저가 요청을 보낸 유저가 아닐 경우 에러 반환
        const checkFeedbackDataFromUser = await feedback.findByPk(feedback_id);
        if (checkFeedbackDataFromUser.from_id !== parseInt(user_id)) throw Error('타 유저가 작성한 피드백에 대한 삭제 권한 없음');

        const feedbackData = await feedback.destroy({
            where: {
                id: feedback_id,
                from_id: user_id
            }
        });

        if (!feedbackData) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, m.DELETE_FEEDBACK_FAIL));
        }
        res.status(sc.OK).send(success(sc.OK, m.DELETE_FEEDBACK_SUCCESS));

    } catch (error) {
        console.log(error)
        res.status(sc.BAD_REQUEST).send(sc.BAD_REQUEST, m.DELETE_FEEDBACK_FAIL);
    }
}

//* request data: team_id, reflection_id
//* query string: members
//* reponse data: id, type, keyword, content, from_id, to_id, team_id, reflection_id
//* 회고의 특정 유저와 유저가 속한 팀의 피드백을 분류하여 조회하는 API
const getTeamAndUserFeedback = async (req, res) => {
    try {
        const user_id = req.user_id;
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
                as: 'from_user',
                attributes: ['username'],
                required: true
            }
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
        include: {
            model: user,
            as: 'from_user',
            attributes: ['username'],
            required: true,
        }
    });

    let category = 'self';
    
    if (user_id.toString() !== member_id.toString()) { 
       category = 'others';
    }

    const responseData = {
        category: category,
        user_feedback: userFeedbackData,
        team_feedback: teamFeedbackData
    }

    return res.status(sc.OK).send(success(sc.OK,m.OK, responseData));

    } catch (error) {
        console.log(error);
        return res.status(sc.BAD_REQUEST).send(sc.BAD_REQUEST, m.GET_FEEDBACK_FAIL);
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