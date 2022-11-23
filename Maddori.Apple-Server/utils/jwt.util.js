const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY;
const request = require('request');
const crypto = require('crypto');

// 새로운 access token 발급
const sign = async (user_id) => {
    const payload = {
        id: user_id
    };
    return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
        expiresIn: '1y',       // 유효기간
        algorithm: 'HS256', // 암호화 알고리즘
    });
}

// token 검증
const verify = async (token, key) => {
    try {
        const decoded = jwt.verify(token, key);
        return {
            type: true,
            decoded: decoded,
        }
    } catch (error) {
        return {
            type: false,
            message: error.message
        }      
    }
}

// 새로운 refresh token 발급
const refresh = async () => {
    return jwt.sign({}, secret, {
        expiresIn: '10y',
        algorithm: 'HS256',
    });
}

// reference: https://stackoverflow.com/questions/38428027/why-await-is-not-working-for-node-request-module
// request에 대한 response가 올 때까지 기다리게 하기 위함
function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

// identity token decode위한 public key 만들기
const generateKey = async (token) => {
    try {
        // 공개키 리스트 가져오기
        let response = await doRequest('https://appleid.apple.com/auth/keys');
        const publicKeyList = JSON.parse(response).keys;

        // identity token의 header값을 이용해 token을 검증할 공개키 JWK 선택
        const tokenHeader = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
        let publicKeyObject;
        for (let key of publicKeyList) {
            if (key['kid'] === tokenHeader['kid'] && key['alg'] === tokenHeader['alg']){
                publicKeyObject = key;
            }
        }
        // 공개키 생성
        const publicKey = crypto.createPublicKey({
            key: publicKeyObject, format: 'jwk'
        });
        const pem = publicKey.export({ type: 'pkcs1', format: 'pem' });

        return {
            type: true,
            key: pem
        }

    } catch (error) {
        return {
            type: false,
            message: error.message
        }   
    }
}

module.exports = {
    sign,
    verify,
    refresh,
    generateKey
}