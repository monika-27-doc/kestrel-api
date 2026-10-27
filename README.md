# kestrel-api

The Kestrel REST API: queue, schedule and monitor background jobs.

- `src/routes/jobs.js` — `POST /v1/jobs`, `GET /v1/jobs`, `GET /v1/jobs/:id`, `DELETE /v1/jobs/:id`
- `src/retries.js` — what happens when a job attempt fails
- `src/limits.js` — rate limits per plan

Public docs: https://documentation-test-1790589425388861236.documentationai.com
