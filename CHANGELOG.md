# Changelog

## 1.0.0 — 2025-05-20

### Changed

- Next.js Boilerplate からコーポレートサイト用構成へ刷新
- ページ本文を `content/` の Markdown に移行（ja / en）
- DDD レイヤ（domain / application / infrastructure / presentation）を導入
- Clerk・DB・分析 SaaS 等の Boilerplate 機能を削除

### Added

- `GetPageUseCase` とファイルシステムベースの `PageRepository`
- Vitest によるユニットテスト
- GitHub Actions CI（lint / test / build）
