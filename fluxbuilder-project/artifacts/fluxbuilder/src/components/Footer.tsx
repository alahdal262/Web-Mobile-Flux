import { Link } from "wouter";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const { toast } = useToast();
  const comingSoon = (label: string) => toast({ title: label, description: "This page is coming soon." });

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">

          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Mobile-WP
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-sm">
              The modern platform for building spectacular mobile-first web applications without writing code. Visually build, instantly deploy.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#features" className="hover:text-violet-400 transition-colors">Features</Link></li>
              <li><Link href="/#showcase" className="hover:text-violet-400 transition-colors">Showcase</Link></li>
              <li><Link href="/#pricing" className="hover:text-violet-400 transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-violet-400 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
              <li><button onClick={()=>comingSoon("Careers")} className="hover:text-violet-400 transition-colors">Careers</button></li>
              <li><button onClick={()=>comingSoon("About Us")} className="hover:text-violet-400 transition-colors">About Us</button></li>
              <li><button onClick={()=>comingSoon("Contact")} className="hover:text-violet-400 transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={()=>comingSoon("Privacy Policy")} className="hover:text-violet-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={()=>comingSoon("Terms of Service")} className="hover:text-violet-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={()=>comingSoon("Cookie Policy")} className="hover:text-violet-400 transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://infragatesolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-400 transition-colors"
            >
              Infragate Solutions LTD
            </a>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
