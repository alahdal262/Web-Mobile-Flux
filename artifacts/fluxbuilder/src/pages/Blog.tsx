import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Blog() {
  const { toast } = useToast();
  const posts = [
    {
      title: "Announcing Mobile-WP 2.0",
      excerpt: "The biggest update to our visual builder yet. Introducing real-time collaboration, custom components, and our new edge deployment network.",
      date: "Oct 12, 2023",
      category: "Product Update",
      image: "bg-gradient-to-br from-violet-500 to-fuchsia-600"
    },
    {
      title: "How to Build a Mobile-First PWA in 2 Hours",
      excerpt: "A step-by-step guide to conceptualizing, designing, and launching a fully functional Progressive Web App using our canvas.",
      date: "Sep 28, 2023",
      category: "Tutorial",
      image: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "The Future of No-Code is Code",
      excerpt: "Why we believe the best visual builders don't hide the code, but instead provide a powerful abstraction layer on top of it.",
      date: "Sep 15, 2023",
      category: "Engineering",
      image: "bg-gradient-to-br from-emerald-500 to-teal-600"
    },
    {
      title: "Designing for Mobile Contexts",
      excerpt: "Best practices for touch targets, typography, and layout flow when designing applications specifically for mobile users.",
      date: "Aug 30, 2023",
      category: "Design",
      image: "bg-gradient-to-br from-orange-400 to-red-500"
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Latest from the team</h1>
          <p className="text-lg text-slate-600">
            Product updates, tutorials, and engineering deep dives from the creators of Mobile-WP.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <article 
              key={i} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`h-48 ${post.image} relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" /> {post.date}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <button onClick={()=>toast({ title: post.title, description: "Full article coming soon. Stay tuned!" })} className="inline-flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
