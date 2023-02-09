const {user, team, reflection, feedback} = require('../../../models');

// request data : user_id, team_id, reflection_id, reflection_name, reflection_date
// response data : reflection_id, reflection_name, date, status
// 팀의 멤버가 팀의 현재 회고에 디테일 정보(이름, 일시)를 추가한다.
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

//* request data: reflection_id, team_id
//* response data: id, reflection_name, date, state, team_id
//* 특정 회고를 종료하는 API
const endInProgressReflection = async (req, res, next) => {
    try {
        const user_id = req.user_id;
        const { reflection_id, team_id } = req.params;

        await reflection.update({
            state: 'Done'
        },{
            where: {
                id: reflection_id,
                team_id: team_id,
                state: 'Progressing'
            }
        });

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

// request data : user_id, team_id, reflection_id
// response data : reflection_id, reflection_name, date, status
// 팀의 멤버가 팀의 현재 회고의 디테일 정보를 초기화한다
const deleteReflectionDetail = async (req, res, next) => {

    try {
        const user_id = req.user_id;
        const { reflection_id } = req.params;

        // 피드백 상세 정보 삭제 (reflection_name과 date를 null로 설정하고 state를 변경한다)
        const updateReflectionSuccess = await reflection.update({
            reflection_name: null,
            date: null,
            state: 'SettingRequired'
        }, {
            where: {
                id: reflection_id,
            },
        });
        const reflectionDetail = await reflection.findByPk(reflection_id);

        res.status(200).json({
            success: true,
            message: '회고 디테일 정보 삭제 성공',
            detail: reflectionDetail
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: '회고 디테일 정보 삭제 실패',
            detail: error.message
        });
    }
}

module.exports = {
    updateReflectionDetail,
    endInProgressReflection,
    deleteReflectionDetail
};