const path = require('path');
__basedir = path.resolve();
const multer = require('multer');

// 이미지 파일만 받도록 필터링
const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('이미지 파일만 업로드할 수 있습니다'));
    }
    cb(null, true);
};

// 서버에 파일 업로드
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 서버에 저장될 위치
        cb(null, __basedir + '/resources/profile_images/');
    },
    filename: function (req, file, cb) {
        // 서버에 저장되는 파일 이름
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter }).single(
    'profile_image'
);

module.exports = {
    uploadFile
};