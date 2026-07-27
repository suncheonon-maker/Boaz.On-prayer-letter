-- ============================================================
-- 특정 글을 항상 맨 위에 고정하기 위한 마이그레이션
-- SQL Editor에 이 내용만 붙여넣고 Run 하세요.
-- ============================================================

alter table public.letters add column if not exists is_pinned boolean not null default false;
