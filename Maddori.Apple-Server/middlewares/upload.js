const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, next) => {
        // 서버에 저장될 위치
        next(null, __basedir + "/app/static/assets/");
    },
    filename: function (req, file, next) {
        // 서버에 저장되는 파일 이름
        next(null, file.originalname + '-' + Date.now())
    }
  });