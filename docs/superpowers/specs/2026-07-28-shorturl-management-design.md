# Short URL Management Page Design

**Date:** 2026-07-28
**Status:** Approved
**Scope:** Frontend management page for existing short URL APIs

## Goal

Add a `/shortUrl` management page that matches the existing Sub Converter dark/light Web Component UI. Users can create short URLs from long URLs, list them with pagination, copy, and delete.

## Decisions

| Topic | Choice |
|-------|--------|
| Features | List + copy + delete + create from long URL |
| Layout | Create form on top, paginated list below |
| Navigation | Header links both ways: 「短链管理」↔「订阅转换」 |
| Implementation | Independent page file + reuse existing components + new `<sub-table>` |
| Backend | Reuse existing APIs; no API changes |

## Architecture

### Routing (already present)

- `GET /shortUrl` → `showShortUrlPage(request, env)` via `page.route.ts`

### Files

| File | Change |
|------|--------|
| `src/page/shortUrl.page.ts` | **New** — full short URL management page HTML + client script |
| `src/page/page.ts` | Re-export / thin wrapper for `showShortUrlPage`; add header nav link to `/shortUrl` on convert page |
| `src/page/components/sub-table.ts` | **New** — `<sub-table>` Web Component |
| `src/page/components/index.ts` | Export `SubTable` |
| `src/routes/page.route.ts` | Already wired; no further change expected |

### Page layout

1. **Header** — same shell as convert page (GitHub icon, title「短链管理」, theme toggle) + nav link「订阅转换」
2. **Create section** — `sub-form` with long URL `sub-textarea` and「生成短链」`sub-button`
3. **List section** — `<sub-table>` with columns short URL, long URL (ellipsis), actions (copy / delete)
4. **Pagination** — page-level controls under the table (not inside `<sub-table>`)

### Data flow

```
Create → POST /api/add { long_url, serve? }
       → success toast → reset to page 1 → reload list

List   → GET /api/queryList?page=&pageSize=
       → set sub-table data attribute

Copy   → clipboard.writeText(row.short_url) → success toast

Delete → confirm → DELETE /api/delete?code= → success toast → reload list
```

`serve` defaults to current origin (`${protocol}//${host}`), consistent with convert page short-url generation.

## `<sub-table>` API

Follow existing component pattern: `SubTable()` returns a `<script>` string that defines a Shadow DOM custom element.

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `columns` | JSON string | `[{ key, title, width?, ellipsis?, type? }]` |
| `data` | JSON string | Row objects array |
| `row-key` | string | Primary key field; default `id` |
| `empty-text` | string | Empty state text; default「暂无数据」 |
| `loading` | boolean attr | Show loading state when present |
| `actions` | JSON string | `[{ key, label, danger? }]` for `type: 'actions'` columns |

### Events

- `table:action` — `detail: { action, row, rowKey }`

### Usage on this page

```html
<sub-table
  row-key="short_code"
  columns='[
    {"key":"short_url","title":"短链"},
    {"key":"long_url","title":"长链","ellipsis":true},
    {"type":"actions","title":"操作","width":"120px"}
  ]'
  actions='[
    {"key":"copy","label":"复制"},
    {"key":"delete","label":"删除","danger":true}
  ]'
  data="[]"
></sub-table>
```

### Styling

Use existing CSS variables (`--border-color`, `--text-primary`, `--background`, `--primary-color`, etc.) so dark/light theme from `theme()` works without extra theme code. Support header row, row borders, hover, and ellipsis for long cells.

Pagination stays **outside** the table component to keep `<sub-table>` focused on rendering rows and emitting actions.

## Pagination & UX

- Default `pageSize = 10`, `page` starts at 1
- Footer:「共 N 条 · 上一页 · 第 x/y 页 · 下一页」
- Disable prev on first page, next on last page
- After successful create, jump to page 1 and refresh
- Delete requires `confirm('确认删除该短链？')`
- Empty long URL on create → error toast; API errors → show message via `SubMessage` / `notification`
- List load failure → error toast + empty table

## Disabled short URL service

When `env.SHORT_URL_ENABLED !== true`:

- Disable create controls
- Set table `empty-text="短链服务未启用"`
- Do **not** call `/api/queryList`

## Out of scope

- Authentication / access control
- Editing an existing long URL
- Search by `code`
- Backend API or schema changes
- Putting pagination inside `<sub-table>`

## Success criteria

1. `/shortUrl` renders a themed page consistent with the convert form
2. User can create, list (paginated), copy, and delete short URLs when the service is enabled
3. Convert ↔ short URL pages are reachable via header links
4. `<sub-table>` is a reusable Web Component following existing `Sub*` patterns
5. Disabled service shows a clear empty/disabled state without API calls
