const { body, validationResult } = require('express-validator');

const validateFeedback = async (req, res, next) => {
    
    try {
        const { type, keyword, content, start_content, to_id } = req.body

        if ( start_content.length > 200 ) {
            throw Error('start 200자 초과');
        }

        if ( content.length > 200 ) {
            throw Error('content 200자 초과')
        }
        
        if ( keyword. length > 11 ) {
            throw Error('키워드 11글자 초과')
        }

        next();
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: '입력 값의 형식이 잘못됨',
            detail: error.message
        })
    }
}

// username 형식 검증 (최대 6글자, 영어/한국어 가능, 특수문자 불가능, 띄어쓰기 불가능)
const validateUsername = [
    body('username')
    .not().isEmpty()
    .withMessage('username 값이 비어있음')
    .isString()
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
        console.log(errors);
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