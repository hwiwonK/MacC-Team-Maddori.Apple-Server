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

module.exports = {
    validateFeedback
}