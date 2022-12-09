const {user, team, reflection, feedback} = require('../../models');

// request data : user_id, team_id
// response data : current_reflection_id, reflection_name, date, status, 회고에 속한 keywords 목록
// 팀에서 진행하는 현재의 회고 정보 가져오기
async function getCurrentReflectionDetail(req, res, next) {
    // console.log("현재 회고 정보 가져오기");

    try {
        const user_id = req.user_id;
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
            order: [
                ['id', 'DESC']
            ],
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

// request data : user_id, team_id, reflection_id, reflection_name, reflection_date
// response data : reflection_id, reflection_name, date, status
// 팀의 리더가 팀의 현재 회고에 디테일 정보(이름, 일시)를 추가한다.
const updateReflectionDetail = async (req, res, next) => {

    try {
        // console.log('회고 정보 추가하기');
        const user_id = req.user_id;
        const { reflection_id } = req.params;
        const { reflection_name, reflection_date } = req.body;

        // 회고 일정 검증 (현 시간보다 이전이면 에러 반환)
        const curDateWithSecond = new Date();
        const curDate = new Date(curDateWithSecond.setSeconds(0, 0));
        const reflectionDate = new Date(reflection_date);
        console.log(curDate);
        console.log(reflectionDate);
        if (reflectionDate < curDate) throw Error('회고 시간이 현 시간 이전');
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

    try {
        const user_id = req.user_id;
        const { team_id } = req.params;
        const reflectionData = await reflection.findAll({
            where: {
                team_id: team_id,
                state: "Done"
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

//* request data: reflection_id, team_id
//* response data: id, reflection_name, date, state, team_id
//* 특정 회고를 종료하는 API
const endInProgressReflection = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { reflection_id, team_id } = req.params;

        await reflection.update(
            {
                state: "Done"
            },
            {
                where:{
                    id: reflection_id,
                    team_id: team_id
                    }
            })
        const data = await reflection.findByPk(reflection_id);
        
        // 새로운 회고 생성 및 team의 현재 회고 id 업데이트
        const newReflectionData = await reflection.create({
            team_id: team_id
        })
        await team.update({
            current_reflection_id: newReflectionData.id
        },{
            where: {
                id: team_id
            }
        });
        // team의 최근 회고 id 업데이트
        await team.update({
            recent_reflection_id: reflection_id
        },{
            where: {
                id: team_id
            }
        });
        
        return res.status(200).json({
            success: true,
            message: "회고 종료 성공",
            detail: {
                reflection: data
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getCurrentReflectionDetail,
    updateReflectionDetail,
    getPastReflectionList,
    endInProgressReflection
};