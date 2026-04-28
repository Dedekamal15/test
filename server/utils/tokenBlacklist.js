/**
 * Token Blacklist (in-memory)
 * For production, replace with Redis:
 *   await redis.setex(`bl:${jti}`, ttlSeconds, '1')
 */

const blacklist = new Map(); // jti -> expiresAt (ms)

// Prune expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [jti, exp] of blacklist) {
    if (now > exp) blacklist.delete(jti);
  }
}, 10 * 60 * 1000);

export function blacklistToken(jti, expiresAt) {
  blacklist.set(jti, expiresAt);
}

export function isBlacklisted(jti) {
  if (!blacklist.has(jti)) return false;
  if (Date.now() > blacklist.get(jti)) {
    blacklist.delete(jti);
    return false;
  }
  return true;
}
