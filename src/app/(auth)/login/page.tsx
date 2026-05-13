"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ identifier: "", password: "", rememberSession: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.data.user, data.data.accessToken);
      router.push("/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in to your Azazel account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-zinc-400 text-sm">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="you@example.com"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20 h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-400 text-sm">Password</Label>
              <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20 h-11 pr-10"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" checked={form.rememberSession}
              onChange={(e) => setForm({ ...form, rememberSession: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500/20 w-4 h-4"
            />
            <Label htmlFor="remember" className="text-sm text-zinc-500 cursor-pointer">Remember me for 30 days</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white border-0 text-sm font-medium">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Create account</Link>
      </p>
    </motion.div>
  );
}
