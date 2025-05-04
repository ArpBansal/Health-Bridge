import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext"; // Import Auth context
import { cn } from "@/lib/utils";
import {
  AlertDialog,
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
  const { isAuthenticated, logout, user, checkAuth } = useAuth();
  
  // Flag to prevent repeated API calls
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check auth once and only if we're authenticated
    if (isAuthenticated && !authChecked) {
      const fetchUserData = async () => {
        try {
          await checkAuth();
        } catch (error) {
          console.error("Error checking authentication:", error);
        } finally {
          setAuthChecked(true);
        }
      };
      
      fetchUserData();
    }
  }, [isAuthenticated, authChecked]); // Only depends on these two values
  
  // Reset authChecked when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthChecked(false);
    }
  }, [isAuthenticated]);

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

  // Check if user is an organization - safely handle potential undefined values
  const isOrganization = user?.role === "organisation" || user?.role === "organization";
  
  // Define navigation links with visibility conditions
  const navLinks = [
    { path: "/", label: 'home', visible: true },
    { path: "/schemes", label: 'schemes', visible: !isAuthenticated || (isAuthenticated && !isOrganization) },
    { path: "/research", label: 'research', visible: true },
    { path: "/blog", label: 'blog', visible: true },
    { path: "/about", label: 'about', visible: true },
    { path: "/contact", label: 'contact', visible: true },
    { path: "/health-assessment", label: 'Health Assessment', visible: !isAuthenticated || (isAuthenticated && !isOrganization) },
    { path: "/chat", label: 'Chat', visible: true },
    { path: "/organization-dashboard", label: 'Organization Dashboard', visible: isAuthenticated && isOrganization }
  ];

  // Filter visible links
  const visibleNavLinks = navLinks.filter(link => link.visible);

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname !== "/") {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-40">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-healthbridge-blue to-healthbridge-teal flex items-center justify-center text-white font-bold shadow-sm">
                HB
              </div>
              <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-healthbridge-dark tracking-tight">
                HealthBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative py-2 text-sm font-medium text-gray-600 transition-all duration-200 group",
                  isActivePath(link.path) ? "text-healthbridge-blue" : "hover:text-healthbridge-blue"
                )}
              >
                {t(link.label)}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal transform origin-left transition-all duration-300",
                    isActivePath(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1.5 px-2 hover:bg-healthbridge-blue/5 focus:bg-healthbridge-blue/5 text-healthbridge-dark h-8 sm:h-9 transition-colors duration-200">
                      <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-healthbridge-blue" />
                      <span className="font-medium text-healthbridge-dark hidden sm:inline">
                        {user?.username || "Account"}
                        {isOrganization && <span className="ml-1 text-xs text-gray-500">(Org)</span>}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-healthbridge-blue">
                          {user?.username || "User"}
                          {isOrganization && <span className="ml-1 text-xs text-gray-500">(Organization)</span>}
                        </span>
                        <span className="text-xs text-gray-500">{user?.email || "No email on file"}</span>
                        {user?.role && <span className="text-xs text-gray-500">Role: {user.role}</span>}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-2">
                      <div className="font-medium text-sm mb-1 text-gray-700">Dashboard</div>
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <div>• Total Logins: <span className="font-medium">1</span></div>
                        <div>• Last Login: <span className="font-medium">Just now</span></div>
                        <div>• Recent Activity: <span className="font-medium">
                          {isOrganization ? 'Organization Dashboard' : 'AI Chat, Schemes'}
                        </span></div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate(isOrganization ? '/organization-dashboard' : '/account-dashboard')} 
                      className="font-medium flex items-center gap-2 hover:bg-healthbridge-blue/5 focus:bg-healthbridge-blue/5 transition-colors duration-200"
                    >
                      <UserIcon className="h-4 w-4" /> 
                      {isOrganization ? 'Organization Dashboard' : 'Account Dashboard'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-medium flex items-center gap-2 hover:bg-red-50 focus:bg-red-50 transition-colors duration-200">
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="hidden lg:flex items-center gap-2 border-healthbridge-blue text-healthbridge-blue hover:bg-healthbridge-blue/5 focus:bg-healthbridge-blue/5 h-9 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">{t('Logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="h-9 transition-colors duration-200">
                    {t('Login')}
                  </Button>
                </Link>
                <Link to="/login" state={{ activeTab: "signup" }}>
                  <Button className="bg-healthbridge-blue hover:bg-healthbridge-teal h-9 transition-colors duration-200" size="sm">
                    {t('Signup')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <LanguageSelector />
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="ml-1.5 h-8 sm:h-9 transition-colors duration-200">
                {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden bg-white border-t transition-all duration-300 ease-in-out",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <nav className="flex flex-col p-3 sm:p-4 space-y-2 sm:space-y-3">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-md relative overflow-hidden group transition-all duration-200",
                isActivePath(link.path) 
                  ? "bg-blue-50 text-healthbridge-blue" 
                  : "hover:bg-gray-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="relative z-10 text-sm">{t(link.label)}</span>
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal w-full transform origin-left transition-all duration-300",
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
                  className="w-full flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full transition-colors duration-200">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/login" state={{ activeTab: "signup" }} className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-healthbridge-blue hover:bg-healthbridge-teal transition-colors duration-200">
                    {t('signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Logout Dialog */}
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
    </header>
  );
};

export default Header;