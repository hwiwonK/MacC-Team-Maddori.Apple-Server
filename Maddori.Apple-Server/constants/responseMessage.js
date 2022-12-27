module.exports = {
    OK: "성공",
    BAD_REQUEST: "요청을 잘못 보냈습니다.",
    PAGE_NOT_FOUND: "요청하신 페이지를 찾을 수 없습니다",
    NEED_LOGIN: "로그인이 필요합니다.",
    NO_CONTENT: "데이터가 없습니다.",
    REPEATED_VALUE: "중복된 데이터입니다.",
    UNAUTHORIZED: "권한이 없습니다",
    INTERNAL_SERVER_ERROR: "서버 내부 오류",
    PASSWORD_NOT_VALID: "비밀번호를 형식이 잘못 되었습니다.",

    // JWT 관련
    NO_TOKEN: "TOKEN이 존재하지 않습니다.",
    TOKEN_INVALID: "TOKEN이 유효하지 않습니다.",
    TOKEN_EXPIRED: "TOKEN이 만료되었습니다.",

    // 로그인, 회원가입 관련
    NOT_FOUND: "",
    INVALID_PASSWORD: "패스워드가 유효하지 않습니다.",
    SIGN_IN_SUCCESS: "로그인 성공",
    SIGN_IN_FAIL: "로그아웃 실패",
    SIGN_UP_SUCCESS: "회원가입 성공",
    SIGN_UP_FAIL: "회원가입 실패",
    USER_EXIST: "존재하는 회원입니다.",

    // 유저 관련
    SET_USER_NICKNAME_SUCCESS: '유저 닉네임 설정 성공',
    SET_USER_NICKNAME_FAIL: '유저 닉네임 설정 실패',
    DELETE_USER_SUCCESS: '유저 정보 삭제 성공',
    DELETE_USER_FAIL: '유저 정보 삭제 실패',
    
    // 회고 관련
    GET_REFLECTION_SUCCESS: '현재 회고 정보 가져오기 성공',
    GET_REFLECTION_FAIL: '현재 회고 정보 가져오기 실패',

    UPDATE_REFLECTION_DETAIL_SUCCESS: '회고 디테일 정보 추가 성공',
    UPDATE_REFLECTION_DETAIL_FAIL: '회고 디테일 정보 추가 실패',
    
    GET_REFLECTION_LIST_SUCCESS: '회고목록 조회 성공',
    GET_REFLECTION_LIST_FAIL: '회고목록 조회 실패',

    END_REFLECTION_SUCCESS: '회고 종료 성공',

    // 팀 관련
    INVALID_INVITATION_CODE: '초대코드가 잘못 됨',
    GET_TEAM_INFO_SUCCESS: '팀 정보 가져오기 성공',
    GET_TEAM_INFO_FAIL: '팀 정보 가져오기 실패',
    WITHDRAW_TEAM_SUCCESS: '유저 팀 탈퇴 성공',
    WITHDRAW_TEAM_FAIL: '유저 팀 탈퇴 실패',
    GET_TEAM_MEMBER_LIST_SUCCESS: '팀의 멤버 목록 가져오기 성공',
    GET_TEAM_MEMBER_LIST_FAIL: '팀의 멤버 목록 가져오기 실패',

    CREATE_TEAM_SUCCESS_APPOINT_TEAM_LEADER: '팀 생성 완료, 유저를 해당 팀의 리더로 설정',
    CREATE_TEAM_FAIL: '팀 생성 실패',
    JOIN_TEAM_SUCCESS: '유저 팀 합류 성공',
    JOIN_TEAM_FAIL: '유저 팀 합류 실패',
    NOT_INCLUDED_USER: '피드백을 받는 유저가 현재 팀에 속하지 않음',

    // 피드백 관련
    CREATE_FEEDBACK_SUCCESS: '피드백 생성하기 성공',
    CREATE_FEEDBACK_FAIL: '피드백 생성하기 실패',
    GET_FEEDBACK_SUCCESS: '피드백 조회 성공',
    GET_FEEDBACK_FAIL: '피드백 조회 실패',
    GET_RECENT_FEEDBACK_SUCCESS: '최근 피드백 조회 성공',
    GET_RECENT_FEEDBACK_FAIL: '최근 피드백 조회 실패',
    FEEDBACK_TYPE_ERROR: '피드백 타입 오류',
    GET_FEEDBACK_LIST_TO_SPECIFIC_MEMBER_SUCCESS: '특정 유저에게 작성한 피드백 목록 가져오기 성공',
    GET_FEEDBACK_LIST_TO_SPECIFIC_MEMBER_FAIL: '특정 유저에게 작성한 피드백 목록 가져오기 실패',
    DELETE_FEEDBACK_SUCCESS: '피드백 삭제 성공',
    DELETE_FEEDBACK_FAIL: '피드백 삭제 실패',
    UPDATE_FEEDBACK_SUCCESS: '피드백 수정 성공',
    UPDATE_FEEDBACK_FAIL: '피드백 수정 실패',



}


