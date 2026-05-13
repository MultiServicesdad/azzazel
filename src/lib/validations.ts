100req / diaimport { z } from 'zod';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Validation Schemas (Zod)
// ═══════════════════════════════════════════════════════════

// ── Auth Schemas ─────────────────────────────────────────
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .transform((v) => v.toLowerCase().trim()),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[@$!%*?&#^()_+\-=]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or username is required')
    .max(255),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberSession: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/\d/, 'Must contain a number')
    .regex(/[@$!%*?&#^()_+\-=]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ── Search Schemas ───────────────────────────────────────
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(500, 'Query too long')
    .trim(),
  type: z.enum([
    'EMAIL', 'USERNAME', 'IP', 'DOMAIN', 'PHONE', 'NAME', 'HASH', 'CRYPTO', 'AUTO'
  ]).default('AUTO'),
});

// ── API Key Schemas ──────────────────────────────────────
export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name too long')
    .trim(),
  permissions: z
    .array(z.string())
    .default([]),
  expiresInDays: z
    .number()
    .min(1)
    .max(365)
    .optional(),
});

// ── Profile Schemas ──────────────────────────────────────
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  avatar: z
    .string()
    .url()
    .optional()
    .nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/\d/)
    .regex(/[@$!%*?&#^()_+\-=]/),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

// ── Admin Schemas ────────────────────────────────────────
export const adminUpdateUserSchema = z.object({
  role: z.enum(['USER', 'PREMIUM', 'ADMIN', 'SUPERADMIN']).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().max(500).optional(),
  emailVerified: z.boolean().optional(),
});

export const featureFlagSchema = z.object({
  key: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/),
  enabled: z.boolean(),
  description: z.string().max(500).optional(),
  rules: z.any().optional(),
});

// ── Type Exports ─────────────────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type FeatureFlagInput = z.infer<typeof featureFlagSchema>;
