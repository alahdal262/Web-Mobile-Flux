import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Smartphone, Zap, LayoutDashboard, Globe, Users,
  LineChart, Code, Sparkles, CheckCircle2, PlayCircle,
  ArrowRight
} from "lucide-react";

// --- Hero Section ---
const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
      <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }`}</style>
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Introducing Mobile-WP 2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Build Mobile Apps <br />
              <span className="text-gradient">Without the Code.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              The professional visual builder for mobile-first web applications. Design beautiful interfaces, connect to any database, and deploy instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
              >
                Start Building Free
              </Link>
              <button 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <PlayCircle className="w-5 h-5" />
                See it in action
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`${import.meta.env.BASE_URL}images/avatar-${i}.png`} 
                    alt={`User ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
                  />
                ))}
              </div>
              <p>Joined by 10,000+ developers & designers</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 bg-slate-900 aspect-[4/3] w-full max-w-[600px]">
              <img
                src={`${import.meta.env.BASE_URL}images/hero-mockup.png`}
                alt="Mobile App Mockup"
                className="w-full h-full object-cover animate-[float_3s_ease-in-out_infinite]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent mix-blend-overlay"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

// --- Features Section ---
const Features = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Visual App Builder",
      desc: "Drag and drop pre-built components to construct complex layouts in seconds."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      desc: "Every component is designed to look perfect and perform flawlessly on mobile devices."
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      desc: "See your changes instantly on the canvas. No waiting for builds or refresh."
    },
    {
      icon: Globe,
      title: "Deploy Anywhere",
      desc: "One-click publish to our global CDN, or export clean React code to host yourself."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Work together in real-time. Leave comments, share previews, and manage permissions."
    },
    {
      icon: LineChart,
      title: "Analytics Dashboard",
      desc: "Track user behavior, page views, and conversions right out of the box."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-violet-600 font-semibold tracking-wide uppercase mb-3">Powerful Features</h2>
          <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Everything you need to build faster</h3>
          <p className="text-lg text-slate-600">
            Mobile-WP provides a comprehensive suite of tools that eliminates boilerplate, so you can focus on your product.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- How It Works Section ---
const HowItWorks = () => {
  const steps = [
    {
      title: "Design visually",
      desc: "Use our intuitive drag-and-drop editor to build your user interface without CSS."
    },
    {
      title: "Connect data",
      desc: "Bind your UI to REST APIs, GraphQL, or our built-in Postgres database instantly."
    },
    {
      title: "Publish with a click",
      desc: "Hit publish and your app goes live globally on our edge network in seconds."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              From idea to production in <span className="text-violet-600">record time</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10">
              We've abstracted away the complex parts of web development. Build enterprise-grade applications without managing infrastructure.
            </p>
            
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-fuchsia-100 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-md mx-auto">
                  fluxbuilder.app/editor
                </div>
              </div>
              <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                 <Code className="w-16 h-16 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Showcase Section ---
const Showcase = () => {
  return (
    <section id="showcase" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">A canvas designed for mobile</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-16">
          Experience a professional IDE-like interface in your browser. Complete with component trees, property panels, and full version history.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/50"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/builder-showcase.png`} 
            alt="Mobile-WP Interface" 
            className="w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

// --- Testimonials Section ---
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Mobile-WP changed how our agency operates. We can now deliver mobile-first PWAs in days instead of months.",
      name: "Sarah Jenkins",
      role: "Lead Designer at Studio",
      avatar: 1
    },
    {
      quote: "The ability to visually map our database to the UI without writing SQL queries is absolutely mind-blowing.",
      name: "Marcus Chen",
      role: "Founder, TechStart",
      avatar: 2
    },
    {
      quote: "I've tried every no-code tool out there. Mobile-WP is the only one that outputs production-ready, clean code.",
      name: "Elena Rodriguez",
      role: "Product Manager",
      avatar: 3
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-slate-900">Loved by builders worldwide</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Zap key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-lg mb-8 font-medium leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={`${import.meta.env.BASE_URL}images/avatar-${t.avatar}.png`} 
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Pricing Section ---
const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      desc: "Perfect for hobbyists and learning.",
      features: ["2 Projects", "Basic components", "Community support", "Mobile-WP branding"],
      highlight: false,
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$29",
      desc: "For professionals shipping to users.",
      features: ["Unlimited Projects", "Custom domains", "API integration", "Priority support", "Remove branding"],
      highlight: true,
      cta: "Start Free Trial"
    },
    {
      name: "Business",
      price: "$99",
      desc: "For teams scaling operations.",
      features: ["Everything in Pro", "Advanced Analytics", "Role-based access", "White-label editor", "SLA"],
      highlight: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-slate-600">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className={`rounded-3xl p-8 hover:shadow-xl transition-all duration-200 ${
                plan.highlight
                  ? "bg-slate-950 text-white shadow-2xl scale-[1.02] ring-2 ring-blue-500 border-2 border-violet-500 relative z-10"
                  : "bg-white text-slate-900 shadow-xl border border-slate-100"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-slate-300" : "text-slate-500"}`}>{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-display font-extrabold">{plan.price}</span>
                <span className={`text-lg ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>/mo</span>
              </div>
              
              <Link href={plan.highlight ? "/signup" : "/login"} className="block w-full">
                <button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 active:scale-[0.97] ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/25"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}>
                  {plan.cta}
                </button>
              </Link>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${plan.highlight ? "text-violet-400" : "text-violet-600"}`} />
                    <span className={plan.highlight ? "text-slate-300" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <Pricing />
    </>
  );
}
