import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Church, Menu, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/sermons", label: "Sermons" },
    { href: "/events", label: "Events" },
  ];

  const NavLink = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => (
    <Link href={href}>
      <a
        className={`transition-colors font-medium ${
          location === href
            ? "text-primary"
            : mobile
            ? "text-foreground hover:text-primary"
            : "text-muted-foreground hover:text-primary"
        } ${mobile ? "block py-2" : ""}`}
        onClick={mobile ? () => setIsOpen(false) : undefined}
        data-testid={`nav-${label.toLowerCase()}`}
      >
        {label}
      </a>
    </Link>
  );

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="flex items-center space-x-2 text-2xl font-bold text-primary" data-testid="logo">
              <Church className="h-8 w-8" />
              <span style={{fontFamily:"Dancing Script"}} className="font-cold text-3xl">FaithLife Ministries</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <Link href="/donations">
              <Button className="bg-accent text-accent-foreground hover:opacity-90" data-testid="button-give-online">
                Give Online
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={logout} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} mobile />
                ))}
                <Link href="/donations">
                  <Button 
                    className="bg-accent text-accent-foreground hover:opacity-90 w-full mt-4" 
                    onClick={() => setIsOpen(false)}
                    data-testid="button-give-online-mobile"
                  >
                    Give Online
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setIsOpen(false)}
                      data-testid="button-admin-mobile"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
