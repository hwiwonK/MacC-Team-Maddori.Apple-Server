const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY;
const request = require('request');

// 새로운 access token 발급
const sign = async (id) => {
    const payload = {
        id: id
    };
    return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
        expiresIn: '100d',       // 유효기간
        algorithm: 'HS256', // 암호화 알고리즘
    });
}

const verify = async (token) => {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            type: true,
            id: decoded.id,
        }
    } catch (error) {
        return error; 
    }
}

// 새로운 refresh token 발급
const refresh = async () => {
    try {
        return jwt.sign({}, secret, {
            expiresIn: '200d',
            algorithm: 'HS256',
        });
    } catch (error) {
        return error; 
    }
}

// token decode 하기
const decode = async (token) => {
    try {
        request.get('https://appleid.apple.com/auth/keys', function(error, response, body) {
            console.log(typeof(body));
            const publicKey = JSON.parse(body).keys;
            console.log(publicKey);
        });
        

    } catch (error) {
        return error; 
    }
}

module.exports = {
    sign,
    verify,
    refresh,
    decode
}