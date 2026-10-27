import { Router } from 'express';
import { createJob, listJobs, getJob, cancelJob } from '../store.js';

export const jobs = Router();

const MAX_PAYLOAD_BYTES = 256 * 1024;

jobs.post('/', async (req, res) => {
  const { type, queue = 'default', payload = {}, runAt } = req.body ?? {};
  if (typeof type !== 'string' || type.length === 0) {
    return res.status(400).json({ code: 'invalid_request', message: '`type` is required.' });
  }
  if (Buffer.byteLength(JSON.stringify(payload)) > MAX_PAYLOAD_BYTES) {
    return res.status(400).json({ code: 'invalid_request', message: '`payload` must be 256 KB or less.' });
  }
  const job = await createJob({ type, queue, payload, runAt }, req.get('Idempotency-Key'));
  res.status(201).json(job);
});

jobs.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  res.json(await listJobs({ status: req.query.status, limit, cursor: req.query.cursor }));
});

jobs.get('/:id', async (req, res) => {
  const job = await getJob(req.params.id);
  if (!job) return res.status(404).json({ code: 'not_found', message: 'No job has this ID.' });
  res.json(job);
});

jobs.delete('/:id', async (req, res) => {
  const job = await cancelJob(req.params.id);
  if (!job) return res.status(404).json({ code: 'not_found', message: 'No job has this ID.' });
  res.json(job);
});
