# 🎵 Emotional Mood Player (EMP)
> 감정과 가사 기반의 맞춤형 음악 추천 서비스  
> 개발 기간: 2024.09 - 2024.10

## 📌 프로젝트 소개
Emotional Mood Player는 사용자의 감정 상태와 선호하는 가사를 기반으로 개인화된 플레이리스트를 생성해주는 음악 추천 서비스입니다. 자연어 처리 기술을 활용하여 가사의 의미를 분석하고, 사용자의 감정 상태에 맞는 최적의 음악을 추천합니다.

## 💫 주요 기능
1. 감정 기반 음악 추천
   - 현재 감정 상태에 따른 맞춤형 플레이리스트 생성
   - 장르, 선호도 기반 추천 알고리즘

2. 가사 기반 음악 추천
   - 선호하는 가사 스타일과 유사한 곡들을 추천
   - 자연어 처리를 통한 가사 분석

3. 플레이리스트 관리
   - 생성된 플레이리스트 저장, 수정, 삭제 기능
   - 개인 맞춤형 플레이리스트 관리

4. 음악 재생
   - Spotify API를 통한 음악 스트리밍 서비스 제공
   - 실시간 음악 재생 및 제어

## 🛠 기술 스택

### Frontend
- React 18.3.1
- Recoil (상태 관리)
- Axios (HTTP 클라이언트)
- React Router DOM
- CSS Modules

### Backend
- TypeScript 5.3.3
- Node.js & Express.js
- Prisma ORM
- MySQL(GCP)

### Authentication & Security
- Passport.js (OAuth2.0)
- Express Session & Session Store
- Cookie Parser

### DevOps & Tools
- ESLint & Prettier
- Winston Logger
- Swagger UI
- Nodemon -> tsx watch(refactor)
- Cross-env
- Lint staged + Husky(refactor)
- Gitmoji(refactor)

## 📂 프로젝트 구조
```
project/
├── frontend/           # 리액트 기반 프론트엔드
├── model_server/       # ML 모델 서버
└── server/            
    ├── @types/        # 전역 타입 정의
    ├── auth/          # 인증 
    ├── infrastructure/# 인프라 설정
    ├── middlewares/   # 미들웨어
    ├── playlists/     # 플레이리스트 기능
    ├── user/           # 유저 관련
    └── shared/        # 공통 유틸리티
```

## 🔑 핵심 기술적 특징

### 백엔드 아키텍처
**3-Tier 아키텍쳐 적용**

### TypeScript 타입 안전성
```typescript
// 요청 타입 체크
interface EmotionPlaylistRequest {
  genres: string;
  song_types: string[];
  prefer_latest: boolean;
}

// 타입 validation 미들웨어
export const validatePlaylist = DTOValidator.validate<EmotionPlaylistRequest>({
  genres: [
    {
      validate: (value): value is string =>
        typeof value === 'string' && VALID_GENRES.includes(value),
      message: '올바른 장르를 선택해주세요.',
    }
  ]
});
```

### 에러 처리
```typescript
// 중앙화 AppError 처리
export class AppError extends Error {
  constructor(
    public readonly name: string,
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## 🚀 시작하기

### 요구사항
- Node.js 18 이상
- MySQL 8.0 이상
- Spotify Premium 계정 (음악 재생 기능)

### 환경 설정
1. 환경 변수 설정
```bash
# .env 파일
NODE_ENV=development
PORT=8888
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=

# OAuth
GOOGLE_CLIENT_ID=
SPOTIFY_CLIENT_ID=

# Session
SESSION_SECRET=
```

2. 설치 및 실행
```bash
# 의존성 설치
npm install


# Prisma 설정
npx prisma generate
npx prisma migrate dev

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm start
```

## 📝 API 문서
- 개발 환경: `http://localhost:8888/api-docs`
- Swagger UI사용

## 👥 Team
- Frontend: 2명
- Backend: 2명
- AI/ML: 1명
