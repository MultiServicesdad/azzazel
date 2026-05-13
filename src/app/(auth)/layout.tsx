import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-violet-500/6 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Azazel<span className="text-zinc-500 font-normal ml-1">OSINT</span></span>
        </Link>
        {children}
        <p className="text-center text-xs text-zinc-600 mt-8">
          © {new Date().getFullYear()} Azazel OSINT. All rights reserved.
        </p>
      </div>
    </div>
  );
}
