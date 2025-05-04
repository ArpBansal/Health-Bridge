import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { 
  Facebook, Twitter, Instagram, Mail, MapPin, Phone, Heart, 
  ChevronRight, Globe, Star, Sparkles, Shield, Youtube, 
  Linkedin, Download, FileText, Users, Headphones, Clock,
  Award, BookOpen, Calendar, MessageCircle, Stethoscope,
  Hospital, Syringe, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "from-blue-600 to-blue-800" },
    { icon: Twitter, href: "#", label: "Twitter", color: "from-blue-400 to-blue-600" },
    { icon: Instagram, href: "#", label: "Instagram", color: "from-blue-500 to-indigo-600" },
    { icon: Youtube, href: "#", label: "Youtube", color: "from-red-500 to-red-700" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "from-blue-500 to-blue-700" },
  ];

  const quickLinks = [
    { label: t('home'), href: "/" },
    { label: t('about'), href: "/about" },
    { label: t('schemes'), href: "/schemes" },
    { label: t('blog'), href: "/blog" },
    { label: t('contact'), href: "/contact" },
  ];

  const resourceLinks = [
    { label: t('faqs'), href: "/faqs", icon: MessageCircle },
    { label: t('privacy_policy'), href: "/privacy", icon: Shield },
    { label: t('terms_of_service'), href: "/terms", icon: FileText },
    { label: t('careers'), href: "/careers", icon: Users },
    { label: t('support'), href: "/support", icon: Headphones },
  ];

  const healthServices = [
    { label: "Telemedicine", href: "/services/telemedicine", icon: Stethoscope },
    { label: "Health Camps", href: "/services/camps", icon: Hospital },
    { label: "Emergency Care", href: "/services/emergency", icon: Syringe },
    { label: "Health Monitoring", href: "/services/monitoring", icon: Activity },
  ];

  const downloadLinks = [
    { label: "Annual Report 2023", href: "/downloads/annual-report-2023.pdf", icon: Download },
    { label: "Healthcare Guide", href: "/downloads/healthcare-guide.pdf", icon: BookOpen },
    { label: "Patient Resources", href: "/downloads/patient-resources.pdf", icon: FileText },
  ];

  const achievements = [
    { number: "50,000+", label: "Patients Served", icon: Users },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "100+", label: "Healthcare Partners", icon: Award },
    { number: "500+", label: "Health Camps", icon: Calendar },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="container relative z-10 px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="backdrop-blur-2xl bg-blue-900/20 rounded-xl p-6 border border-blue-300/20 text-center"
            >
              <achievement.icon className="w-8 h-8 text-blue-300 mx-auto mb-4" />
              <h4 className="text-3xl font-bold text-blue-100 mb-2">{achievement.number}</h4>
              <p className="text-blue-300">{achievement.label}</p>
            </div>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-blue-950/10 p-12 shadow-2xl border border-blue-300/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-20">
            <div className="space-y-12 lg:col-span-4">
              <Link to="/" className="group inline-flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">HealthBridge</h2>
                  <p className="text-blue-200">{t('footer_description')}</p>
                </div>
              </Link>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-blue-200">
                  <MapPin className="w-5 h-5" />
                  <span>{t('footer_address')}</span>
                </div>
                <div className="flex items-center gap-4 text-blue-200">
                  <Phone className="w-5 h-5" />
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center gap-4 text-blue-200">
                  <Mail className="w-5 h-5" />
                  <span>info@healthbridge.com</span>
                </div>
              </div>

              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 flex items-center justify-center text-blue-200 hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">{t('quick_links')}</h3>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-blue-200 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">{t('resources')}</h3>
                <ul className="space-y-4">
                  {resourceLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-blue-200 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Health Services</h3>
                <ul className="space-y-4">
                  {healthServices.map((service, index) => (
                    <li key={index}>
                      <Link
                        to={service.href}
                        className="text-blue-200 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <service.icon className="w-4 h-4" />
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Downloads</h3>
                <ul className="space-y-4">
                  {downloadLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-blue-200 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200 text-sm">
              © {currentYear} HealthBridge. {t('rights_reserved')}
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-blue-200 hover:text-white text-sm transition-colors">
                {t('privacy')}
              </Link>
              <Link to="/terms" className="text-blue-200 hover:text-white text-sm transition-colors">
                {t('terms')}
              </Link>
              <Link to="/cookies" className="text-blue-200 hover:text-white text-sm transition-colors">
                {t('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
