import type { PlanType } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Censorship Service
// ═══════════════════════════════════════════════════════════

interface CensorOptions { plan: PlanType }

export function censorFields(
  fields: Record<string, string | undefined>,
  options: CensorOptions
): Record<string, string | undefined> {
  const c = { ...fields };
  
  // If PREMIUM, no censorship at all
  if (options.plan === 'PREMIUM') return c;

  for (const [k, v] of Object.entries(c)) {
    if (!v) continue;
    if (k === 'email') c[k] = censorEmail(v, options.plan);
    else if (k === 'password') c[k] = censorPassword(v, options.plan);
    else if (k === 'phone') c[k] = censorPhone(v, options.plan);
    else if (k === 'ip') c[k] = censorIP(v, options.plan);
    else if (k === 'address') c[k] = '[REDACTED]';
    else if (k === 'name') c[k] = censorName(v, options.plan);
  }
  return c;
}

function censorEmail(e: string, plan: PlanType): string {
  const [l, d] = e.split('@');
  if (!d) return '***@***';
  if (plan === 'FREE') return `${l[0]}***@${d}`;
  return e; // Premium handled above, but keeping for safety
}

function censorPassword(p: string, plan: PlanType): string {
  if (plan === 'FREE') return '********';
  return p;
}

function censorPhone(ph: string, plan: PlanType): string {
  if (plan === 'FREE') return `${ph.slice(0, 3)}***${ph.slice(-2)}`;
  return ph;
}

function censorIP(ip: string, plan: PlanType): string {
  const p = ip.split('.');
  if (p.length !== 4) return ip;
  if (plan === 'FREE') return `${p[0]}.${p[1]}.*.*`;
  return ip;
}

function censorName(n: string, plan: PlanType): string {
  if (plan === 'FREE') return n.split(' ').map(w => `${w[0]}***`).join(' ');
  return n;
}

export function calculateSeverity(
  fields: Record<string, string | undefined>
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  let s = 0;
  if (fields.password) s += 4;
  if (fields.hash) s += 3;
  if (fields.phone) s += 2;
  if (fields.address) s += 3;
  if (fields.ip) s += 1;
  if (fields.email) s += 1;
  if (s >= 8) return 'CRITICAL';
  if (s >= 5) return 'HIGH';
  if (s >= 3) return 'MEDIUM';
  return 'LOW';
}
