const validateFeedback = async (req, res, next) => {
    
    try {
        const { type, keyword, content, start_content, to_id } = req.body

        if ( start_content.length > 200 ) {
            throw Error('start 200자 초과');
        }

        if ( content.length > 200 ) {
            throw Error('content 200자 초과')
        }
        
        const numberPattern = /[0-9]/;
        const alphaPattern = /[a-zA-Z]/;
        const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        const symbolPattern = /[~!@#\#$%<>^&*]/;

        if (alphaPattern.test(keyword) && koreanPattern.test(keyword)) {
            throw Error('한글, 알파벳을 혼용');
        }

        if (alphaPattern.test(keyword)) {
            if (keyword.length > 15) {
                throw Error('키워드 15글자 초과');
            }
        }

        if (koreanPattern.test(keyword)) {
            if (keyword.length > 11) {
                throw Error('키워드 11글자 초과');
            }
        }

        next();
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// {
//     "type" : "Continue",
//     "keyword" : "화이팅",
//     "content": "너무 잘해요",
//     "start_content": "앞으로도 화이팅",
//     "to_id": 2
// }


module.exports = {
    validateFeedback
}