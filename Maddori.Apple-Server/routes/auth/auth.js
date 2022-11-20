const {user, team, reflection, feedback } = require('../../models');
const jwt = require('../../utils/jwt.util');
// const request = require('request'); // TODO: 추후 적용

const socialLogin = async (req, res, next) => {
    // code : authorization code, token : identity token
    // TODO : authorization code 받아오기 (apple 공식키 사용 token 생성 전환시 사용)
    const { token } = req.body;
    console.log('로그인 요청');
    try {
        // TODO : 공개키 가져오기 적용
        // request.get('https://appleid.apple.com/auth/keys', function(error, response, body) {

        // });

        // TODO : 알맞은 공개키 찾아 decoding에 적용하기
        // identity token 값에서 user 정보 가져오기

        const { email, sub, ...others } = jwt.decode(token);

        console.log(jwt.decode(token));
    
        // 이미 있는 user인지 확인하기
        const [loginedUser, created] = user.findOrCreate({
            attributes: ['id', 'username', 'team_id'],
            where: {
                sub: sub,
                email: email
            },
            include: {
                model: userteam,
                required: true
            }
        });
        
        console.log(loginedUser);

        // token 생성
        const accessToken = jwt.sign(loginedUser.id);
        const refreshToken = jwt.refresh(); // TODO: refresh token db에 저장하기

        console.log(accessToken);
        console.log(refreshToken);
        
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
                        id: loginedUser.id,
                        username: loginedUser.username ?? null,
                        team_id: loginedUser.team_id ?? null    
                    }
                }
            });
        }
        // 새로 생성된 user일 경우
        res.status(200).json({
            success: true,
            message: '유저 회원가입/로그인 성공',
            detail: {
                created: true,
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    id: loginedUser.id,
                    username: null,
                    team_id: null    
                }
            }
        });

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