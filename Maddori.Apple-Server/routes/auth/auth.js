const {user, team, reflection, feedback } = require('../../models');
const jwt = require('../../utils/jwt.util');
const request = require('request');
const { restart } = require('nodemon');

const socialLogin = async (req, res, next) => {
    // code : authorization code, token : identity token
    const { code, token } = req.body;
    try {
        // 공개키 가져오기
        // request.get('https://appleid.apple.com/auth/keys', function(error, response, body) {

        // });
        // identity token 값에서 user 정보 가져오기
        const { email, sub, ...others } = jwt.decode(token);
    
        // 이미 있는 user인지 확인하기
        const loginedUser = user.findOrCreate({
            attributes: ['id', 'username', 'team_id'],
            where: {
                sub: sub
            },
            include: {
                model: userteam,
                required: true
            }
        });
        // // 이미 있는 user : user 정보 return
        // if (loginedUser !== null) {
        //     res.status(200).json({
        //         success: true,
        //         message: '유저 로그인 성공',
        //         detail: {
        //             created : false,
        //             user: loginedUser
        //         }
        //     });
        // }
        


        res.status(200).json(sub);

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(500).json({
            success: false,
            message: '로그인 처리 실패',
            detail: error.message
        });
    }
}



module.exports = {
    socialLogin
}