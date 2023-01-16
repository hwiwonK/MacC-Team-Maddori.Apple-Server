<img src="https://user-images.githubusercontent.com/81340603/204945336-287ce115-ac38-409f-8136-039ae4d5e140.png" />
<h3 align="center">키고: KeyGo</h3>
<p align="center">KeyGo를 통해 솔직하고 재미있는 팀 회고 시간을 가져 보아요!</p>

<div style="display: flex; flex-direction: column;" align="center" >
  <a href="https://apps.apple.com/kr/app/%ED%82%A4%EA%B3%A0-keygo/id6444039454?l=en">
    <img src="https://user-images.githubusercontent.com/81340603/204947353-18c33fe9-c49b-443a-b1e2-7cf9a85bb91b.png" width=180px />
  </a>
  <p3>&nbsp;&nbsp;&nbsp;</p3>
  <a href="https://github.com/DeveloperAcademy-POSTECH/MacC-Team-Maddori.Apple">
    <img src="https://user-images.githubusercontent.com/67336936/208497719-c46a8b55-2c13-4a6c-b7ae-5e834d7eefb2.png" width=60px/>
  </a>
</div>


<h2>🧐 Preview</h2>
<img src="https://user-images.githubusercontent.com/81340603/204951310-45345674-3d00-4d72-a61b-bc6ddc996363.png" />

<div align="center">
  ➿<br>
  상황을 키워드와 함께 기록하며, 회고 당일 피드백을 잊지 않고 전할 수 있습니다<br>
  팀 내에서 등록된 키워드를 확인하며, 예정된 회고 내용을 미리 볼 수 있습니다<br>
  회고 당일, 내가 받은 키워드를 확인하고 상세 상황을 들어보며 피드백을 나눌 수 있습니다<br>
  지금까지 내가 받은 피드백을 모아볼 수 있습니다<br>
  ➿
</div>

<br>

<h2>🛠️ Tech Stack</h2>

- **Node.js**
- **Express.js** : 서버 개발
- **Sequelize ORM** : ORM
- **MySQL** : 데이터베이스
- **dotenv** : 환경 변수 사용 (데이터베이스 연결 정보, token 생성에 사용되는 secret key 정보)
- **jsonwebtoken** : token 생성, token 복호화
  <br>
  [token 관련 코드](https://github.com/hwiwonK/MacC-Team-Maddori.Apple-Server/blob/develop/Maddori.Apple-Server/utils/jwt.util.js)
- **Request.js** : apple social login의 public key 받아오기
  <br>
  [Request.js 사용 코드](https://github.com/hwiwonK/MacC-Team-Maddori.Apple-Server/blob/develop/Maddori.Apple-Server/utils/jwt.util.js#L43)

<br>

<h2>📡 API</h2>

[api 명세서](https://spice-gym-2c0.notion.site/01dd09bc75684367a1f4fd522ad7a63e?v=011951e252f749f395815fb88c791944)

<br>

<h2>🪜 Architecture</h2>

![Architecture](https://user-images.githubusercontent.com/67336936/208499945-5e0624b6-2dcf-48be-bfb8-19ad312adf10.png)

<br>

<h2>📂 File Structure</h2>

![File Structure](https://user-images.githubusercontent.com/67336936/208499994-94627a04-1027-4a38-8c7c-ec486648dd1d.png)

<br>

<h2>👩‍💻 How to use</h2>

1. 데이터베이스 세팅하기 

    서버에서 사용할 데이터 베이스 생성 및 데이터베이스 서버 실행
2. 환경 변수 파일 (.env) 생성

    데이터베이스 연결 및 토큰 생성에 사용할 정보 입력
    
    ```
    DB_USERNAME = 데이터베이스 유저 정보
    DB_PASSWORD = 데이터베이스 비밀번호
    DB_DATABASE = 데이터베이스 이름
    DB_HOST = 데이터베이스 IP 정보
    DB_PORT = 데이터베이스 포트 정보
    
    JWT_KEY = access token 생성에 사용할 secret key
    ```    
3. 서버 실행

    `npm run start`
    위 명령어로 서버 실행 시 데이터베이스 연결, 테이블 미생성 상태일 시 테이블 생성
4. 테스트 데이터 삽입

    `sequelize db:seed --seed testData.js`
    위 명령어로 데이터베이스에 테스트 데이터 삽입 실행

<br>

<h2>👨‍👩‍👧‍👦 Development Culture</h2>

**확실한 문서화를 통해 개발 내용과 개발 진척 상황을 명확히 하고, 코드 컨벤션/ 상세한 PR/ 코드 리뷰를 통해 코드의 통일성을 맞추어 나갑니다.**

1. api 명세서 작성
    
    요청 형식, 요청이 성공적으로 수행되었을 때 응답, 요청이 실패했을 때 응답 등 상세한 정보를 담은 api 명세서를 작성하여 클라이언트 개발 - 서버 개발 간의 소통을 명확히합니다.
    
2. backlog 작성
    
    앞으로 추가될 기능, 발견된 버그, 사소한 수정 사항 등을 backlog 문서에 정리하고 각 task에 우선순위를 부여합니다. backlog 문서를 기반으로 앞으로 해야할 task를 판단하고, 프로젝트 전반적인 개발 진행 상황을 파악합니다.
    
3. [git convention](https://github.com/hwiwonK/MacC-Team-Maddori.Apple-Server/wiki/Git-Convention)
    
    issue, branch, pull request convention을 통해 코드가 안정적으로 관리될 수 있도록 합니다.
    
4. [code convention](https://github.com/hwiwonK/MacC-Team-Maddori.Apple-Server/wiki/Code-Convention)
    
    코드 작성 규칙을 통일하여 통일감이 있는 코드를 작성합니다.


<br>





