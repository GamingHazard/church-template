import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Sermons from "@/pages/sermons";
import Events from "@/pages/events";
import Donations from "@/pages/donations";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import CustomizePage from './pages/customize';

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/sermons" component={Sermons} />
          <Route path="/events" component={Events} />
          <Route path="/donations" component={Donations} />
          <Route path="/admin" component={Admin} />
          <Route path="/customize" component={CustomizePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
