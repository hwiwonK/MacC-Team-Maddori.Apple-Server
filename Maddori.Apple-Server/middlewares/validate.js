const { text } = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

// 글자 수 제한 값
const textLimit = {
    feedbackKeywordLimit: 10,
    feedbackContentLimit: 400,
    usernameLimit: 6,
    teamNameLimit: 10,
    reflectionNameLimit: 15,
    nicknameLimit: 6
}

// 피드백 keyword, content 형식 검증 (글자 수 제한)
const validateFeedback = [
    body('keyword')
        .not().isEmpty()
        .withMessage('keyword 값이 비어있음')
        .isString()
        .withMessage('keyword는 문자열 형식이어야 함')
        .isLength({ max: textLimit.feedbackKeywordLimit })
        .withMessage(`keyword 글자 수 제한(${textLimit.feedbackKeywordLimit}자) 초과`),
    body('content')
        .not().isEmpty()
        .withMessage('content 값이 비어있음')
        .isString()
        .withMessage('content는 문자열 형식이어야 함')
        .isLength({ max: textLimit.feedbackContentLimit })
        .withMessage(`content 글자 수 제한(${textLimit.feedbackContentLimit}자) 초과`),
    
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

// username 형식 검증 (글자 수 제한, 특수문자 불가능, 띄어쓰기 불가능)
const validateUsername = [
    body('username')
        .not().isEmpty()
        .withMessage('username 값이 비어있음')
        .isString()
        .withMessage('username은 문자열 형식이어야 함')
        .isLength({ max: textLimit.usernameLimit })
        .withMessage(`username 글자 수 제한(${textLimit.usernameLimit}자) 초과`)
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

// username 형식 검증 (글자 수 제한, 특수문자 불가능, 띄어쓰기 불가능)
const validateNickname = [
    body('nickname')
        .not().isEmpty()
        .withMessage('nickname 값이 비어있음')
        .isString()
        .withMessage('nickname은 문자열 형식이어야 함')
        .isLength({ max: textLimit.nicknameLimit })
        .withMessage(`nickname 글자 수 제한(${textLimit.nicknameLimit}자) 초과`)
        .custom((value) => {
            const pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/ // 특수문자
            const pattern2 = /\p{Extended_Pictographic}/u; // 이모지
            if (!!pattern.test(value) || !!pattern2.test(value)) {
                throw new Error('nickname 특수문자 포함 불가');
            }
            return true;
        })
        .custom((value) => !/\s/.test(value))
        .withMessage('nickname 띄어쓰기 포함 불가'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // uploadFile에서 서버에 저장된 프로필 이미지 파일 삭제
            if (req.file) {
                try {
                    fs.unlinkSync(__basedir + '/resources' + req.file.path.split('resources')[1]);
                } catch (error) {
                    // console.log(error);
                }
            }
            return res.status(400).json({
                success: false,
                message: '입력 값의 형식이 잘못됨',
                detail: errors.array()[0].msg
            })
        }
        next();
    }
]

// team_name 형식 검증 (글자 수 제한, 특수문자 불가능)
const validateTeamname = [
    body('team_name')
        .not().isEmpty()
        .withMessage('team_name 값이 비어있음')
        .isString()
        .withMessage('team_name은 문자열 형식이어야 함')
        .isLength({ max: textLimit.teamNameLimit })
        .withMessage(`team_name 글자 수 제한(${textLimit.teamNameLimit}자) 초과`)
        .custom((value) => {
            const pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/ // 특수문자
            const pattern2 = /\p{Extended_Pictographic}/u; // 이모지
            return !(!!pattern.test(value) || !!pattern2.test(value));
        })
        .withMessage('team_name은 특수문자를 포함할 수 없습니다'),
    
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

// reflection_name 형식 검증 (글자 수 제한)
const validateReflectionname = [
    body('reflection_name')
        .not().isEmpty()
        .withMessage('reflection_name 값이 비어있음')
        .isString()
        .withMessage('reflection_name은 문자열 형식이어야 함')
        .isLength({ max: textLimit.reflectionNameLimit })
        .withMessage(`reflection_name 글자 수 제한(${textLimit.reflectionNameLimit}글자) 초과`),

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
    validateUsername,
    validateTeamname,
    validateReflectionname,
    validateNickname
}