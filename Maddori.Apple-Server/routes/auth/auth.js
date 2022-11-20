const {user, team, userteam, reflection, feedback } = require('../../models');
const jwtUtil = require('../../utils/jwt.util');
const jwt = require('jsonwebtoken');
// const request = require('request'); // TODO: 추후 적용

const appleLogin = async (req, res, next) => {
    // code : authorization code, token : identity token
    // TODO : authorization code 받아오기 (apple 공식키 사용 token 생성 전환시 사용)
    const { token } = req.body;
    console.log('로그인 요청');
    try {
        // TODO : 알맞은 공개키 찾아 decoding에 적용하기
        // identity token 값에서 user 정보 가져오기
        const { email, sub, ...others } = jwt.decode(token);
    
        // 이미 있는 user인지 확인하기
        const [loginedUser, created] = await user.findOrCreate({
            where: {
                sub: sub,
                email: email
            },
            defaults: {
                sub: sub,
                email: email
            },
            include: {
                attributes: ['team_id'],
                model: userteam         
            },
            raw: true
        });

        // token 생성
        const accessToken = await jwtUtil.sign(loginedUser.id);
        const refreshToken = await jwtUtil.refresh(loginedUser.id);
        
        // 이미 있는 user일 경우
        if (created === false) {
            res.status(200).json({
                success: true,
                message: '유저 로그인 성공',
                detail: {
                    created: false,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: {
                        username: loginedUser.username ?? null,
                        team_id: loginedUser['userteams.team_id'] ?? null    
                    }
                }
            });
        } else {
            // 새로 생성된 user일 경우
            res.status(200).json({
                success: true,
                message: '유저 회원가입과 로그인 성공',
                detail: {
                    created: true,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: {
                        username: null,
                        team_id: null    
                    }
                }
            });
        }

    } catch (error) {
        // TODO: 에러 처리 수정
        res.status(500).json({
            success: false,
            message: '유저 로그인 실패',
            detail: error.message
        });
    }
}



module.exports = {
    appleLogin
}