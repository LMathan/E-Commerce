"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        addToast({ type: "error", title: "Invalid email or password" });
      } else {
        addToast({ type: "success", title: "Logged in successfully" });
        router.push("/account");
      }
    } catch {
      addToast({ type: "error", title: "Authentication error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-neutral-200/90 shadow-2xl p-6 sm:p-10 overflow-hidden">
        {/* Left Form Section (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
              <Sparkles className="h-4 w-4 fill-neutral-950 text-amber-500" />
            </div>
            <span className="text-xl font-black tracking-tight text-neutral-900 font-serif">
              Nexora<span className="text-amber-500">.</span>
            </span>
          </Link>

          <div>
            <h1 className="text-3xl font-black text-neutral-900 font-serif">Welcome Back</h1>
            <p className="text-xs text-neutral-500 mt-1">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700">Password</label>
                <Link href="#" className="text-[11px] font-bold text-amber-600 hover:text-amber-700">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500" />
              <label htmlFor="remember" className="text-xs text-neutral-600">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-neutral-950 py-3.5 text-xs font-extrabold text-white hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-md"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-3 pt-2">
            <div className="relative text-center before:absolute before:inset-0 before:top-1/2 before:border-t before:border-neutral-200">
              <span className="relative bg-white px-3 text-[10px] font-bold uppercase text-neutral-400">Or continue with</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100">
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100">
                <span>Apple</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-bold text-amber-600 hover:text-amber-700">
              Create account
            </Link>
          </p>
        </div>

        {/* Right Lifestyle Image Banner (6 cols) */}
        <div className="hidden lg:block lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80"
            alt="A Better You Every Day"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <h3 className="text-2xl font-black font-serif">A Better You Every Day</h3>
            <p className="text-xs text-neutral-300">Join thousands of happy customers discovering minimalist curated essentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
