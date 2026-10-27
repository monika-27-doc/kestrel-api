// Rate limits per plan, counted per workspace across all of its keys.
export const PLAN_LIMITS = {
  free: { requestsPerMinute: 60, requestsPerDay: 10_000, concurrentRequests: 5 },
  pro: { requestsPerMinute: 600, requestsPerDay: 250_000, concurrentRequests: 25 },
  enterprise: { requestsPerMinute: 'custom', requestsPerDay: 'custom', concurrentRequests: 'custom' },
};
