# Hockey puck lifestyle images

Puck frame designer lifestyle images are served from the **shared** assets bucket (same as puzzle, currency, ticket-frames), under **`puck/lifestyle/`**.

The app uses `getSharedAssetUrl("puck/lifestyle/puck-lifestyle-N.jpg")` and `NEXT_PUBLIC_CDN_SHARED_URL`.

**26 images:** `puck-lifestyle-1.jpg` … `puck-lifestyle-26.jpg`

## Upload to R2 (shared bucket)

### Option A: Script (recommended)

From **`useful-scripts`** (env in `.env` or `.env.r2`). The script maps **Puck*Frame_Lifestyle*(N)\_\*.jpg** (or **puck-lifestyle-N.jpg**) to **puck-lifestyle-1.jpg** … **26** and uploads to the shared bucket – no manual rename needed.

```bash
cd useful-scripts
npm run r2:upload-puck-lifestyle -- ../../puck-lifecycle <your-shared-bucket>
# or: node cloudflare-r2-upload-puck-lifestyle.mjs --dir ../../puck-lifecycle --bucket <your-shared-bucket> [--dry-run]
```

Use the same **shared** R2 bucket as for puzzle/currency (`NEXT_PUBLIC_CDN_SHARED_URL`).

### Option B: Manual rename, then upload

1. Rename source files to `puck-lifestyle-1.jpg` … `puck-lifestyle-26.jpg` in order.
2. Upload: `npm run r2:upload-dir -- ./path/to/renamed-folder <your-shared-bucket> --prefix puck/lifestyle`

Without the shared CDN, the app falls back to relative paths; ensure your dev setup serves shared assets or set `NEXT_PUBLIC_CDN_SHARED_URL` for local testing.
