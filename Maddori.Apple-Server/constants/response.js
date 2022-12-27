module.exports = {
    success: (status, message, detail) => {
        return {
            status,
            success: true,
            message,
            detail,
        };
    },
    fail: (status, message) => {
        return {
            status,
            success: false,
            message,
        };
    },
};