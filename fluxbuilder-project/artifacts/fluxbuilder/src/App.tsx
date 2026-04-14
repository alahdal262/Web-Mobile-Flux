import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateApp from "./pages/CreateApp";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

async function fetchCurrentUser() {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json() as Promise<{ userId: string; email: string; fullName?: string }>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}

// Utility component to scroll to top on route change
function ScrollToTop() {
  const [pathname] = useLocation();
  
  useEffect(() => {
    // Wait slightly to ensure rendering is complete before scrolling
    setTimeout(() => {
      // Don't scroll to top if we're dealing with anchor links (handled by browser natively)
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, 0);
  }, [pathname]);

  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Dashboard - full screen, no Navbar/Footer — requires auth */}
        <Route path="/dashboard">
          <RequireAuth><Dashboard /></RequireAuth>
        </Route>
        <Route path="/create">
          <RequireAuth><CreateApp /></RequireAuth>
        </Route>

        {/* Auth routes without Navbar/Footer */}
        <Route path="/login">
          <Auth mode="login" />
        </Route>
        <Route path="/signup">
          <Auth mode="signup" />
        </Route>
        
        {/* Main app routes with Layout */}
        <Route>
          <MainLayout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/docs" component={Docs} />
              <Route path="/blog" component={Blog} />
              <Route component={NotFound} />
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
