# JWT Authorization Server

### 1. 프로젝트 개요
- 프로젝트 명: JWT Authorization Server
- 개발 인원: 1명(Baeg-won)
- 개발 기간: 2023.09.01 ~ 2023.09.06
- 주요 기능
  - 로그인
    - ID, Password 유효성 검사
    - Access-token, Refresh-token 생성
  - 로그아웃
    - Refresh-token 조회 및 삭제
  - 로그인 유지
    - 토큰 검증 및 재발급
- 개발 언어: Typescript
- 개발 환경: NestJS, IntelliJ
- 데이터베이스: MariaDB(MySQL)
- 형상관리 툴: GitHub

<hr>

### 2. 프로젝트 요구사항
- 로그인
  - 아이디, 비밀번호 검사
  - Access-token, Refresh-token 생성
  - Refresh-token은 추후 Access-token 재발급을 위해 DB에 저장
- 로그인 유지
  - 기본적으로 Access-token이 만료되면 자동으로 로그아웃 되도록 설정되어 있음
  - 로그인 상태를 유지하기 위해 Refresh-token이 만료되지 않는 한 Access-token을 재발급 받을 수 있음
  - 만약 Access-token이 만료되지 않았음에도 재발급 요청 시 기존 Access-token 그대로 반환
- 로그아웃
  - 로그아웃 시 DB에 저장되었던 Refresh-token이 제거됨

<hr>

### 3. UML
- login
![image](https://github.com/Baeg-won/auth-backend/assets/45421117/f83dc212-9e35-4323-9b62-3c9ef7e2c04e)

- logout
![image](https://github.com/Baeg-won/auth-backend/assets/45421117/78f97839-f3fb-4cb3-800b-2cc1343cff62)

- reissue
![image](https://github.com/Baeg-won/auth-backend/assets/45421117/db4ca608-a778-4ba2-9023-08508fde1076)

<hr>

설계 문서:
https://autumn-owl-e22.notion.site/64221463bbb94b5fa101f0d645fb0749?pvs=4
