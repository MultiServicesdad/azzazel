import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { generateRandomHex, sha256 } from '@/lib/crypto-utils';
import { prisma } from '@/lib/prisma';
import { AZAZEL_ID_BYTES, AZAZEL_ID_PREFIX } from '@/lib/constants';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Auth Service
// Handles registration, login, sessions, tokens, Azazel ID
// ═══════════════════════════════════════════════════════════

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const secret = new TextEncoder().encode(JWT_SECRET);
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const BCRYPT_ROUNDS = 12;

// ── Azazel ID Generation ─────────────────────────────────
export function generateAzazelId(): string {
  return `${AZAZEL_ID_PREFIX}${generateRandomHex(AZAZEL_ID_BYTES)}`;
}

// ── Password Hashing ─────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Token Generation ─────────────────────────────────────
export async function generateAccessToken(payload: {
  userId: string;
  role: string;
}): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('azazel-osint')
    .setAudience('azazel-client')
    .setExpirationTime(ACCESS_EXPIRY)
    .sign(secret);
}

export function generateRefreshToken(): string {
  return generateRandomHex(48);
}

export async function verifyAccessToken(token: string): Promise<{
  userId: string;
  role: string;
} | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'azazel-osint',
      audience: 'azazel-client',
    });
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

// ── Verification Token ───────────────────────────────────
export function generateVerifyToken(): string {
  return generateRandomHex(32);
}

// ── Fingerprint Generation ───────────────────────────────
export async function generateFingerprint(
  userAgent: string,
  ip: string,
  acceptLanguage?: string
): Promise<string> {
  const raw = `${userAgent}|${ip}|${acceptLanguage || ''}`;
  return sha256(raw);
}

// ── CSRF Token ───────────────────────────────────────────
export function generateCsrfToken(): string {
  return generateRandomHex(32);
}

// ── Register ─────────────────────────────────────────────
export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  // Check existing
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email.toLowerCase() },
        { username: data.username },
      ],
    },
  });

  if (existing) {
    if (existing.email === data.email.toLowerCase()) {
      throw new Error('Email already registered');
    }
    throw new Error('Username already taken');
  }

  const azazelId = generateAzazelId();
  const passwordHash = await hashPassword(data.password);
  const verifyToken = generateVerifyToken();

  const user = await prisma.user.create({
    data: {
      azazelId,
      email: data.email.toLowerCase(),
      username: data.username,
      passwordHash,
      verifyToken,
      subscription: {
        create: {
          plan: 'FREE',
          dailySearches: 3,
          searchResetAt: new Date(),
        },
      },
    },
    select: {
      id: true,
      azazelId: true,
      email: true,
      username: true,
      role: true,
      emailVerified: true,
      avatar: true,
      createdAt: true,
    },
  });

  // TODO: Send verification email
  console.log(`[Auth] Verification token for ${user.email}: ${verifyToken}`);

  return { user, verifyToken };
}

// ── Login ────────────────────────────────────────────────
export async function loginUser(data: {
  identifier: string;
  password: string;
  ip: string;
  userAgent: string;
  rememberSession?: boolean;
}) {
  const identifier = data.identifier.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: data.identifier }, // username is case-sensitive
      ],
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.banned) {
    throw new Error('Account has been suspended');
  }

  const passwordValid = await verifyPassword(data.password, user.passwordHash);
  if (!passwordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = await generateAccessToken({
    userId: user.id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken();
  const fingerprint = await generateFingerprint(data.userAgent, data.ip);

  // Create session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (data.rememberSession ? 30 : 7));

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      fingerprint,
      ip: data.ip,
      userAgent: data.userAgent,
      expiresAt,
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: data.ip,
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
      entity: 'session',
      ip: data.ip,
      userAgent: data.userAgent,
      metadata: { fingerprint },
    },
  });

  return {
    user: {
      id: user.id,
      azazelId: user.azazelId,
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
    },
    accessToken,
    refreshToken,
    expiresAt,
  };
}

// ── Refresh Token ────────────────────────────────────────
export async function refreshAccessToken(data: {
  refreshToken: string;
  ip: string;
  userAgent: string;
}) {
  const session = await prisma.session.findUnique({
    where: { refreshToken: data.refreshToken },
    include: {
      user: {
        select: {
          id: true,
          azazelId: true,
          email: true,
          username: true,
          role: true,
          emailVerified: true,
          avatar: true,
          banned: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error('Invalid session');
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new Error('Session expired');
  }

  if (session.user.banned) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new Error('Account suspended');
  }

  // Rotate refresh token (security best practice)
  const newRefreshToken = generateRefreshToken();
  const newAccessToken = await generateAccessToken({
    userId: session.user.id,
    role: session.user.role,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      ip: data.ip,
      userAgent: data.userAgent,
      rotatedAt: new Date(),
    },
  });

  return {
    user: {
      ...session.user,
      createdAt: session.user.createdAt.toISOString(),
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

// ── Logout ───────────────────────────────────────────────
export async function logoutUser(refreshToken: string) {
  await prisma.session.deleteMany({
    where: { refreshToken },
  });
}

// ── Verify Email ─────────────────────────────────────────
export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    throw new Error('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken: null,
    },
  });

  return { email: user.email };
}

// ── Forgot Password ─────────────────────────────────────
export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if email exists
    return;
  }

  const resetToken = generateVerifyToken();
  const resetTokenExp = new Date();
  resetTokenExp.setHours(resetTokenExp.getHours() + 1);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExp },
  });

  // TODO: Send reset email
  console.log(`[Auth] Reset token for ${user.email}: ${resetToken}`);
}

// ── Reset Password ───────────────────────────────────────
export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  // Invalidate all sessions
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  return { email: user.email };
}

// ── Get User from Token ──────────────────────────────────
export async function getUserFromToken(accessToken: string) {
  const payload = await verifyAccessToken(accessToken);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      azazelId: true,
      email: true,
      username: true,
      role: true,
      emailVerified: true,
      avatar: true,
      createdAt: true,
      subscription: {
        select: {
          plan: true,
          status: true,
          dailySearches: true,
          searchesUsed: true,
          searchResetAt: true,
        },
      },
    },
  });

  return user;
}
