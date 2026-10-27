// In-memory job store used by the API process. Production uses Postgres.
import { randomBytes } from 'node:crypto';

const jobsById = new Map();
const byIdempotencyKey = new Map();

const newId = () => 'job_' + randomBytes(4).toString('hex');

export async function createJob({ type, queue, payload, runAt, retryPolicy }, idempotencyKey) {
  if (idempotencyKey && byIdempotencyKey.has(idempotencyKey)) {
    return jobsById.get(byIdempotencyKey.get(idempotencyKey));
  }
  const job = {
    id: newId(),
    type,
    queue,
    payload,
    retryPolicy: retryPolicy ?? null,
    status: runAt ? 'scheduled' : 'queued',
    attempts: 0,
    runAt: runAt ?? null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  jobsById.set(job.id, job);
  if (idempotencyKey) byIdempotencyKey.set(idempotencyKey, job.id);
  return job;
}

export async function listJobs({ status, limit }) {
  const all = [...jobsById.values()].reverse().filter((j) => !status || j.status === status);
  return { data: all.slice(0, limit), nextCursor: null };
}

export async function getJob(id) {
  return jobsById.get(id) ?? null;
}

export async function cancelJob(id) {
  const job = jobsById.get(id);
  if (!job) return null;
  if (job.status === 'queued' || job.status === 'scheduled') job.status = 'cancelled';
  return job;
}
