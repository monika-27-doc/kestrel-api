// What happens when a job attempt fails.
// Each job can set its own retry policy. Jobs without one get DEFAULT_RETRY_POLICY.

export const DEFAULT_RETRY_POLICY = {
  maxRetries: 5,
  backoff: 'exponential',
  initialDelaySeconds: 10,
};

export const MAX_RETRIES_LIMIT = 10;
const MAX_DELAY_SECONDS = 3600;

export function validateRetryPolicy(policy) {
  if (policy === undefined) return null;
  const { maxRetries, backoff, initialDelaySeconds } = policy;
  if (maxRetries !== undefined && (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > MAX_RETRIES_LIMIT)) {
    return `retryPolicy.maxRetries must be a whole number from 0 to ${MAX_RETRIES_LIMIT}.`;
  }
  if (backoff !== undefined && backoff !== 'exponential' && backoff !== 'fixed') {
    return 'retryPolicy.backoff must be "exponential" or "fixed".';
  }
  if (initialDelaySeconds !== undefined && !(initialDelaySeconds >= 1 && initialDelaySeconds <= MAX_DELAY_SECONDS)) {
    return `retryPolicy.initialDelaySeconds must be from 1 to ${MAX_DELAY_SECONDS}.`;
  }
  return null;
}

export function nextRetry(job) {
  const policy = { ...DEFAULT_RETRY_POLICY, ...job.retryPolicy };
  const retriesUsed = job.attempts - 1;
  if (retriesUsed >= policy.maxRetries) {
    return null; // no retries left: the job becomes `failed`
  }
  const delay = policy.backoff === 'fixed'
    ? policy.initialDelaySeconds
    : policy.initialDelaySeconds * 2 ** retriesUsed;
  return { delaySeconds: Math.min(delay, MAX_DELAY_SECONDS) };
}
