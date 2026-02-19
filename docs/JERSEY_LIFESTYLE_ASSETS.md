# Jersey lifestyle images

Jersey frame designer lifestyle images are served from the **shared** assets bucket (same as puzzle, currency, puck), under **`jersey/lifestyle/`**.

The app uses `getSharedAssetUrl("jersey/lifestyle/jersey-lifestyle-N.jpg")` and `NEXT_PUBLIC_CDN_SHARED_URL`.

**16 images:** `jersey-lifestyle-1.jpg` … `jersey-lifestyle-16.jpg`

## Upload to R2 (shared bucket)

### Option A: Script (recommended)

From **`useful-scripts`** (env in `.env` or `.env.r2`). The script maps **10727_jersey_lifestyle_01.jpg** / **jersey_lifestyle_01.jpg** (or **jersey-lifestyle-1.jpg**) to **jersey-lifestyle-1.jpg** … **16** and uploads to the shared bucket.

```bash
cd useful-scripts
npm run r2:upload-jersey-lifestyle -- ../../jersey <your-shared-bucket>
# or: node cloudflare-r2-upload-jersey-lifestyle.mjs --dir ../../jersey --bucket <your-shared-bucket> [--dry-run]
```

Use the same **shared** R2 bucket as for puzzle/currency/puck (`NEXT_PUBLIC_CDN_SHARED_URL`).

### Option B: Manual rename, then upload

1. Rename source files to `jersey-lifestyle-1.jpg` … `jersey-lifestyle-16.jpg` in order.
2. Upload: `npm run r2:upload-dir -- ./path/to/renamed-folder <your-shared-bucket> --prefix jersey/lifestyle`
