const jwtUtil = require('jsonwebtoken');
const secret = process.env.JWT_KEY;

// 새로운 access token 발급
const sign = async (id) => {
    const payload = {
        id: id
    };
    return jwtUtil.sign(payload, secret, { // secret으로 sign하여 발급하고 return
        expiresIn: '100d',       // 유효기간
        algorithm: 'HS256', // 암호화 알고리즘
    });
}

const verify = async (token) => {
    try {
        const decoded = jwtUtil.verify(token, secret);
        return {
            type: true,
            id: decoded.id,
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        } 
    }
}

// 새로운 refresh token 발급
const refresh = async () => {
    try {
        return jwtUtil.sign(payload, secret, {
            expiresIn: '200d',
            algorithm: 'HS256',
        });
    } catch (error) {

    }
}

module.exports = {
    sign,
    verify,
    refresh
}