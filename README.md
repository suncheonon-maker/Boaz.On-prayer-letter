# 기도편지 웹사이트

Next.js(App Router) + Tailwind CSS + Supabase로 만든 기도편지 사이트입니다.

- 최근 기도편지 글과 사진을 메인 페이지에 보여줍니다.
- 글 하단의 **🙏 기도로 동역하기** 버튼을 누르면 Supabase `prayers` 테이블에 기록되고,
  현재까지 동역자 수가 실시간(Realtime)으로 갱신됩니다.
- 모바일 화면에 맞춘 반응형 디자인입니다.

---

## 0. 준비물: Node.js 설치

이 컴퓨터에는 아직 Node.js가 설치되어 있지 않습니다. 아래 방법 중 하나로 먼저 설치해주세요.
(둘 중 하나만 하면 됩니다.)

### 방법 A. nvm으로 설치 (추천 — 버전 관리가 쉬움)

터미널(Terminal.app)을 열고 아래 명령을 순서대로 실행하세요.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

설치 후 터미널을 껐다가 다시 열고:

```bash
nvm install --lts
nvm use --lts
node -v
```

`v20.x.x` 같은 버전이 출력되면 성공입니다.

### 방법 B. Homebrew로 설치

Homebrew가 이미 있다면:

```bash
brew install node
```

Homebrew가 없다면 [brew.sh](https://brew.sh) 안내에 따라 먼저 설치한 뒤 위 명령을 실행하세요.

---

## 1. 프로젝트 의존성 설치

터미널에서 이 폴더로 이동한 뒤 설치합니다.

```bash
cd ~/Desktop/prayer-letter-app
npm install
```

---

## 2. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 에서 회원가입 후 **New Project** 생성 (지역은 Northeast Asia/Seoul 권장, DB 비밀번호는 잘 보관하세요).
2. 프로젝트가 만들어지면 왼쪽 메뉴 **SQL Editor** 로 이동합니다.
3. 이 저장소의 [`supabase/schema.sql`](supabase/schema.sql) 파일 내용을 전체 복사해서 SQL Editor에 붙여넣고 **Run**을 클릭합니다.
   - `letters`(기도편지 글) 테이블과 `prayers`(기도 동역 카운트) 테이블이 생성됩니다.
   - 두 테이블 모두 Row Level Security(RLS)가 켜져 있고, 공개 읽기 + `prayers`는 공개 쓰기(insert)까지 허용하는 정책이 함께 생성됩니다. `letters`는 쓰기 정책이 없어서 대시보드에서 본인만 글을 추가할 수 있습니다.
   - `prayers` 테이블이 실시간(Realtime) publication에 자동으로 추가되어, 버튼을 누르는 즉시 다른 접속자 화면의 숫자도 함께 올라갑니다.
   - 스크립트 마지막에 카자흐스탄 단기선교 기도편지 예시 글이 하나 자동으로 들어갑니다. 나중에 Table Editor에서 자유롭게 수정/삭제하면 됩니다.

4. 왼쪽 메뉴 **Project Settings → API** 로 이동해서 아래 두 값을 복사해둡니다.
   - `Project URL`
   - `anon public` API key

---

## 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 새로 만들고, 위에서 복사한 값을 넣습니다.
([`.env.local.example`](.env.local.example) 파일을 참고하세요.)

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 아래처럼 채워주세요.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`.env.local`은 `.gitignore`에 포함되어 있어 깃허브 등에 올라가지 않습니다.

---

## 4. 로컬에서 실행하기

```bash
npm run dev
```

터미널에 나오는 주소(기본값 http://localhost:3000)를 브라우저로 열면 됩니다.
휴대폰 화면 크기로 보고 싶다면 브라우저 개발자도구의 반응형 보기 모드를 사용하거나,
같은 와이파이에 연결된 휴대폰에서 `http://[이 컴퓨터의 IP]:3000` 으로 접속해보세요.

---

## 5. 새 기도편지 글 올리는 방법

지금은 별도의 글쓰기 화면 없이, Supabase 대시보드에서 직접 글을 추가하는 방식입니다.

1. 사진을 올리려면: Supabase 대시보드 **Storage** 메뉴에서 `letter-images` 같은 이름으로
   **Public** 버킷을 하나 만들고, 사진 파일을 업로드합니다. 업로드 후 파일을 클릭하면
   `https://xxxxx.supabase.co/storage/v1/object/public/letter-images/파일명.jpg` 형태의
   공개 URL을 얻을 수 있습니다.
2. **Table Editor → letters** 테이블로 이동해서 **Insert row**를 클릭합니다.
   - `title`: 글 제목
   - `content`: 본문 (줄바꿈은 그대로 반영됩니다)
   - `image_url`: 위에서 복사한 사진 URL (사진이 없으면 비워둬도 됩니다)
3. 저장하면 메인 페이지에 가장 최근 글(가장 늦은 `created_at`)이 자동으로 노출됩니다.

> 지금 메인 페이지에 들어있는 예시 글의 사진은 프로젝트 안의 로컬 이미지
> (`public/images/kazakhstan-prayer-letter.png`, `카자흐스탄 단기선교 메인 사진.png`를 복사한 파일)를
> 사용하고 있어서 별도 업로드 없이 바로 보입니다. 실제 운영 시에는 위 방식대로 Storage에 사진을 올려
> 교체해주세요.

---

## 6. 배포 (선택)

동역자들에게 링크로 공유하려면 [Vercel](https://vercel.com)에 배포하는 것이 가장 간단합니다.

1. 이 프로젝트를 GitHub 저장소로 올립니다.
2. Vercel에서 해당 저장소를 Import 합니다.
3. Vercel 프로젝트의 **Environment Variables**에 `.env.local`과 동일하게
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 등록합니다.
4. Deploy를 누르면 `https://프로젝트명.vercel.app` 같은 주소가 생성됩니다.

---

## 프로젝트 구조

```
prayer-letter-app/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx        # 전체 레이아웃, 메타데이터
│  │  ├─ page.tsx          # 메인 페이지 (최근 기도편지 1건 조회)
│  │  └─ globals.css       # Tailwind 진입점
│  ├─ components/
│  │  ├─ PrayerLetterCard.tsx  # 글/사진 카드
│  │  └─ PrayerButton.tsx      # 기도 동역 버튼 + 실시간 카운트
│  └─ lib/
│     ├─ supabase.ts       # Supabase 클라이언트 생성 함수
│     └─ types.ts          # 타입 정의
├─ supabase/
│  └─ schema.sql           # 테이블/정책/Realtime 설정 SQL
├─ public/images/           # 로컬 예시 사진
└─ .env.local.example
```

## 참고: 중복 카운트 관련

같은 브라우저에서는 한 번 누르면 버튼이 비활성화되고 localStorage에 표시가 남아
다시 누를 수 없게 되어 있습니다. 다만 로그인 기능은 없기 때문에, 다른 기기나
브라우저의 시크릿 모드에서는 다시 누를 수 있습니다. 정확한 1인 1회 집계가
필요하시면 추후 카카오/이메일 로그인 등 인증 기능 추가를 고려해보시면 됩니다.
