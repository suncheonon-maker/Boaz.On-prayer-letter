-- ============================================================
-- 이미 schema.sql을 한 번 실행하신 프로젝트용 마이그레이션입니다.
-- (사진 1장 -> 여러 장 갤러리 지원)
-- SQL Editor에 그대로 붙여넣고 Run 하세요. 한 번만 실행하면 됩니다.
-- ============================================================

alter table public.letters add column if not exists image_urls text[] not null default '{}';

update public.letters
set image_urls = array[image_url]
where image_url is not null and image_urls = '{}';

alter table public.letters drop column if exists image_url;
