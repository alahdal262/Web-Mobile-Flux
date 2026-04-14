import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Zap, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth({ mode = "login" }: { mode?: "login" | "signup" }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body: Record<string, string> = { email, password };
    if (!isLogin && fullName) body.fullName = fullName;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setIsLoading(false);
        return;
      }

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: "Redirecting to your dashboard...",
      });
      navigate("/dashboard");
    } catch {
      setError("Network error — please try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12">
        <Link href="/" className="flex items-center gap-2 group mb-16 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
            Mobile-WP
          </span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            {isLogin ? "Log in to your account" : "Create an account"}
          </h1>
          <p className="text-slate-500 mb-8">
            {isLogin ? "Welcome back! Please enter your details." : "Start building mobile apps in minutes."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={isLogin ? 1 : 8}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-violet-600 focus:ring-violet-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <button type="button" onClick={()=>toast({ title:"Password Reset", description:"Check your email for a password reset link (demo)." })} className="font-medium text-violet-600 hover:text-violet-700">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl px-4 py-3 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Get Started"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <button type="button" onClick={()=>toast({ title:"GitHub Sign In", description:"GitHub OAuth is not configured in this demo." })} className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-3 hover:bg-slate-50 active:scale-[0.98] transition-all">
            <Github className="w-5 h-5" />
            GitHub
          </button>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-violet-600 hover:text-violet-700">
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-700 to-orange-500 opacity-90 mix-blend-multiply"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-lg text-white border border-white/20 bg-black/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">
          <div className="mb-6 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Zap key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
            "Mobile-WP saved us months of development time. It's the most powerful visual builder we've ever used."
          </h2>
          <div className="flex items-center gap-4 mt-8">
            <img 
              src={`${import.meta.env.BASE_URL}images/avatar-1.png`} 
              alt="Testimonial"
              className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
            />
            <div>
              <div className="font-bold">Sarah Jenkins</div>
              <div className="text-white/70 text-sm">Lead Designer, Studio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
