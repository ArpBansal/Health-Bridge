import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext"; // Import Auth context
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user} = useAuth(); // Get authentication state and logout function

  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Handle logout
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const navLinks = [
    { path: "/", label: 'home' },
    { path: "/schemes", label: 'schemes' },
    { path: "/research", label: 'research' },
    { path: "/blog", label: 'blog' },
    { path: "/about", label: 'about' },
    { path: "/contact", label: 'contact' },
    { path: "/health-assessment", label: 'Health Assessment' },
    { path: "/chat", label: 'Chat' }

  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname !== "/") {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-40">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-healthbridge-blue to-healthbridge-teal flex items-center justify-center text-white font-bold shadow-md">
            HB
          </div>
          <span className="font-display text-2xl font-bold text-healthbridge-dark hidden md:block tracking-tight">
            HealthBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative py-2 text-healthbridge-dark transition-colors group",
                isActivePath(link.path) ? "text-healthbridge-blue" : "hover:text-healthbridge-blue"
              )}
            >
              {t(link.label)}
              <div
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal transform origin-left transition-transform duration-300",
                  isActivePath(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-healthbridge-blue/10 focus:bg-healthbridge-blue/10 text-healthbridge-dark">
                    <UserIcon className="h-5 w-5 text-healthbridge-blue" />
                    <span className="font-semibold text-healthbridge-dark">
                      {user?.username || "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg text-healthbridge-blue">{user?.username}</span>
                      <span className="text-xs text-gray-500">{user?.email || "No email on file"}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-2">
                    <div className="font-semibold text-sm mb-1 text-gray-700">Dashboard</div>
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <div>• Total Logins: <span className="font-bold">1</span></div>
                      <div>• Last Login: <span className="font-bold">Just now</span></div>
                      <div>• Recent Activity: <span className="font-bold">AI Chat, Schemes</span></div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account-dashboard')} className="font-semibold flex items-center gap-2 hover:bg-healthbridge-blue/10 focus:bg-healthbridge-blue/10 hover:text-healthbridge-blue focus:text-healthbridge-blue">
                    <UserIcon className="h-4 w-4" /> Account Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-semibold flex items-center gap-2 hover:bg-healthbridge-blue/10 focus:bg-healthbridge-blue/10">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 border-healthbridge-blue text-healthbridge-blue hover:bg-healthbridge-blue/10 focus:bg-healthbridge-blue/10"
              >
                <LogOut size={16} />
                {t('Logout')}
              </Button>
              <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out of your HealthBridge account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancelLogout}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmLogout}>Log out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t('Login')}
                </Button>
              </Link>
              <Link to="/login" state={{ activeTab: "signup" }}>
                <Button className="bg-healthbridge-blue hover:bg-healthbridge-teal" size="sm">
                  {t('Signup')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md relative overflow-hidden group",
                  isActivePath(link.path) 
                    ? "bg-blue-50 text-healthbridge-blue" 
                    : "hover:bg-gray-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">{t(link.label)}</span>
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal w-full transform origin-left transition-transform duration-300",
                    isActivePath(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    {t('logout')}
                  </Button>
                  <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to log out of your HealthBridge account?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelLogout}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmLogout}>Log out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link to="/login" state={{ activeTab: "signup" }} className="w-full" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-healthbridge-blue hover:bg-healthbridge-teal">
                      {t('signup')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;