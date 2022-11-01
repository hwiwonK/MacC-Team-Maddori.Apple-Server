const {user, team, userteam, reflection, feedback} = require('../../models');

// TODO : social login, token 생성 방식으로 변경
// user의 name을 받아 새로운 user 생성하기
async function userLogin(req, res, next) {
    console.log("유저 로그인");
    console.log(req.body);
    const userContent = req.body;
    console.log(userContent);
    // TODO: username 데이터 없는 경우 에러 처리 추가

    try {
        const createdUser = await user.create(userContent);
        console.log(createdUser);
        res.status(201).send(createdUser);
        // TODO: response 과정 에러 처리 추가
    } catch(error) {
        // TODO: 에러 처리 수정
        res.status(500).send(error);
    }
}

module.exports = {
    userLogin,
};