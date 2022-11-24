const { body, validationResult } = require('express-validator');

const validateFeedback = [
    body('keyword')
        .not().isEmpty()
        .withMessage('keyword 값이 비어있음')
        .isString()
        .withMessage('keyword는 문자열 형식이어야 함')
        .isLength({ max: 11 })
        .withMessage('keyword 글자 수 제한(11글자) 초과'),
    body('content')
        .not().isEmpty()
        .withMessage('content 값이 비어있음')
        .isString()
        .withMessage('content는 문자열 형식이어야 함')
        .isLength({ max: 200 })
        .withMessage('keyword 글자 수 제한(200글자) 초과'),
    body('start_content')
        .isString()
        .withMessage('start_content는 문자열 형식이어야 함')
        .isLength({ max: 200 })
        .withMessage('start_content 글자 수 제한(200글자) 초과'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 값의 형식이 잘못됨',
                detail: errors.array()[0].msg
            })
        }
        next();
    }
]

// username 형식 검증 (최대 6글자, 영어/한국어 가능, 특수문자 불가능, 띄어쓰기 불가능)
const validateUsername = [
    body('username')
        .not().isEmpty()
        .withMessage('username 값이 비어있음')
        .isString()
        .withMessage('username은 문자열 형식이어야 함')
        .isLength({ max: 6 })
        .withMessage('username 글자 수 제한(6글자) 초과')
        .custom((value) => {
            const pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/ // 특수문자
            const pattern2 = /\p{Extended_Pictographic}/u; // 이모지
            if (!!pattern.test(value) || !!pattern2.test(value)) {
                throw new Error('username 특수문자 포함 불가');
            }
            return true;
        })
        .custom((value) => !/\s/.test(value))
        .withMessage('username 띄어쓰기 포함 불가'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 값의 형식이 잘못됨',
                detail: errors.array()[0].msg
            })
        }
        next();
    }
]

module.exports = {
    validateFeedback,
    validateUsername
}