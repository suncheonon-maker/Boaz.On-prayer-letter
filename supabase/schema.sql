-- ============================================================
-- 기도편지 웹사이트 - Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 이 파일 내용을 그대로 붙여넣고 실행하세요.
-- ============================================================

create extension if not exists pgcrypto;

-- 1) letters: 기도편지 게시글
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.letters enable row level security;

-- 누구나(anon) 기도편지를 읽을 수 있도록 허용
create policy "letters are publicly readable"
  on public.letters
  for select
  using (true);

-- 글쓰기는 정책을 만들지 않습니다. 즉, 관리자(본인)만 Supabase 대시보드의
-- Table Editor에서 직접 글을 추가/수정할 수 있고, 외부에서는 쓸 수 없습니다.


-- 2) prayers: '🙏 기도로 동역하기' 버튼을 누른 기록 (동역자 수 카운트용)
create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.prayers enable row level security;

-- 누구나 현재 인원수를 집계(select)할 수 있도록 허용
create policy "anyone can view prayer count"
  on public.prayers
  for select
  using (true);

-- 누구나 '기도로 동역하기' 버튼을 눌러 행을 추가(insert)할 수 있도록 허용
create policy "anyone can add a prayer"
  on public.prayers
  for insert
  with check (true);

-- 실시간(Realtime)으로 count가 갱신되도록 prayers 테이블을 publication에 추가
alter publication supabase_realtime add table public.prayers;


-- ============================================================
-- 첫 기도편지 예시 글입니다. 그대로 실행해서 넣고, 나중에 Table Editor에서
-- title/content를 자유롭게 수정하세요.
--
-- image_url은 우선 프로젝트에 포함된 로컬 이미지 경로(/images/kazakhstan-prayer-letter.png)를
-- 사용합니다. Supabase Storage에 사진을 올리셨다면 그 공개 URL로 바꿔주세요.
-- ============================================================
insert into public.letters (title, content, image_url) values (
  '카자흐스탄 기도편지',
  '사랑하는 동역자 여러분, 평안하신가요?

이번 여름 카자흐스탄 단기선교를 통해 만난 학생들과 현지 성도님들을 마음에 품고 이 편지를 씁니다. 낯선 땅에서 문화수업과 코리안나이트로 마음을 나누고, 함께 예배하며 하나님의 사랑을 전할 수 있었던 것이 큰 은혜였습니다.

예상치 못한 어려움도 있었지만, 팀원 모두가 무사히 사역을 마치고 돌아올 수 있었던 것 역시 기도로 함께해주신 동역자 여러분 덕분입니다.

이 자리를 통해 만난 카자흐스탄의 학생들과 교회가 계속해서 신앙 안에서 자라가도록, 그리고 다음 사역을 준비하는 저희를 위해 함께 기도로 동역해 주세요.',
  '/images/kazakhstan-prayer-letter.png'
);
