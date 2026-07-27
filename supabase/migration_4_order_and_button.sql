-- ============================================================
-- 글 순서를 자유롭게 정하고, 기도 버튼을 특정 글에 붙이기 위한 마이그레이션
-- SQL Editor에 이 내용만 붙여넣고 Run 하세요.
-- ============================================================

alter table public.letters add column if not exists sort_order integer not null default 0;
alter table public.letters add column if not exists show_prayer_button boolean not null default false;
