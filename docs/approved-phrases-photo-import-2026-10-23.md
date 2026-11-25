# WortWelt — 13 approved phrases, permanent local assets (2026-10-23)

The user reviewed and approved individual photorealistic 768x768 WebP photographs for phrases 2 and 6–17. This commit adds the 13 **actual binary media files** under `public/photos/approved/phrases-<N>.webp` as GitHub Git blobs. `src/data.ts` points at the local /photos/approved/ URI, so no external Floot dependency remains for these 13 images. Keep the old /photos/situations/*.svg media for fallback and for legacy-generating QA; the app selects the new photos.

**Reviewed images:** phrases-2, phrases-6, phrases-7, phrases-8, phrases-9, phrases-10, phrases-11, phrases-12, phrases-13, phrases-14, phrases-15, phrases-16, phrases-17.
**Scope:** exactly 13 cards changed; all other catalog rows unchanged. The Vercel build and the live app need to be verified after publication before claiming deployment. Metadata image coverage is not visual QA coverage. Manual visual QA remains 18/1174 (1.53%).
