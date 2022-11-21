const {user, team, userteam, reflection, feedback, usertoken } = require('../../models');
const jwtUtil = require('../../utils/jwt.util');
const jwt = require('jsonwebtoken');

// request data: identity token
// response data: access_token, refresh_token, user 정보
// apple social login을 진행하고, 토큰을 발급한다.
const appleLogin = async (req, res, next) => {
    // TODO : authorization code 받아오기 (apple 공식키 사용 token 생성 전환시 사용)
    const { token } = req.body;

    try {
        // identity token 검증 위한 공개키 생성하기
        let publicKeyPem;
        await jwtUtil.generateKey(token).then((result) => {
            if (result.type === false) {
                throw Error('public key 생성 실패');
            }
            publicKeyPem = result.key;
        });

        // 공개키를 사용한 identity token 검증 및 identity token 값에서 user 정보 가져오기
        let decoded;
        await jwtUtil.verify(token, publicKeyPem).then((result) => {
            if (result.type === false) {
                throw Error(result.message);
            }
            decoded = result.decoded;
        });
        const { email, sub, ...others } = decoded;
    
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
            // refresh token db에 업데이트
            await usertoken.update({
                refresh_token: refreshToken,
            },{
                where: {
                    user_id: loginedUser.id
                }
            });

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
            // refresh token db에 업데이트
            await usertoken.create({
                user_id: loginedUser.id,
                refresh_token: refreshToken
            });

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
        res.status(400).json({
            success: false,
            message: '유저 로그인 실패',
            detail: error.message
        });
    }
}

module.exports = {
    appleLogin
}