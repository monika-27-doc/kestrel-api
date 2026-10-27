// What happens when a job attempt fails.
// Every job gets the same policy: up to 3 retries, with a growing delay.

export const MAX_RETRIES = 3;

// Delay before each retry, in seconds: 2nd attempt, 3rd attempt, 4th attempt.
export const RETRY_DELAYS = [10, 60, 300];

export function nextRetry(job) {
  const retriesUsed = job.attempts - 1;
  if (retriesUsed >= MAX_RETRIES) {
    return null; // no retries left: the job becomes `failed`
  }
  return { delaySeconds: RETRY_DELAYS[retriesUsed] };
}
