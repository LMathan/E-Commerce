"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        addToast({ type: "success", title: "Account created! Please sign in." });
        router.push("/auth/login");
      } else {
        const data = await res.json();
        addToast({ type: "error", title: data.error || "Registration failed" });
      }
    } catch {
      addToast({ type: "error", title: "Failed to create account" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-neutral-200/90 shadow-2xl p-6 sm:p-10 overflow-hidden">
        {/* Left Form Section */}
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
            <h1 className="text-3xl font-black text-neutral-900 font-serif">Create Account</h1>
            <p className="text-xs text-neutral-500 mt-1">Join Nexora for exclusive offers & order tracking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nathan L."
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

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
              <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-neutral-950 py-3.5 text-xs font-extrabold text-white hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-amber-600 hover:text-amber-700">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Image Banner */}
        <div className="hidden lg:block lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80"
            alt="Join Nexora"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
