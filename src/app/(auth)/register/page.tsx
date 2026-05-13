"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "", username: "", password: "", confirmPassword: "", acceptTerms: false,
  });

  const passwordChecks = [
    { label: "8+ characters", valid: form.password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "Number", valid: /\d/.test(form.password) },
    { label: "Special character", valid: /[@$!%*?&#^()_+\-=]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!form.acceptTerms) {
      setError("You must accept the terms");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/login?registered=true");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-zinc-500">Start with 3 free daily searches</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400 text-sm">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 h-11" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-400 text-sm">Username</Label>
            <Input id="username" type="text" placeholder="johndoe" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 h-11" required minLength={3} maxLength={32} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-400 text-sm">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 h-11 pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex flex-wrap gap-2 mt-2">
                {passwordChecks.map((c) => (
                  <span key={c.label} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${c.valid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {c.valid && <Check className="w-3 h-3" />}{c.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-400 text-sm">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 h-11" required />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500/20 w-4 h-4 mt-0.5" />
            <Label htmlFor="terms" className="text-sm text-zinc-500 cursor-pointer leading-tight">
              I agree to the <span className="text-violet-400">Terms of Service</span> and <span className="text-violet-400">Privacy Policy</span>
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white border-0 text-sm font-medium">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
      </p>
    </motion.div>
  );
}
