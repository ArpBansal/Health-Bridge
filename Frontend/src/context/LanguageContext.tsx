import { createContext, useState, useContext, ReactNode } from 'react';

// Language options
type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'ur' | 'gu' | 'kn' | 'ml';

type LanguageLabels = {
  [key in Language]: string;
};

const languageLabels: LanguageLabels = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  ur: 'اردو (Urdu)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
};

// Custom translations type
type CustomTranslations = {
  [key: string]: string;
} | null;

// Translation data structure
type Translations = {
  [key: string]: {
    [lang in Language]?: string;
  };
};


// Initial translations data
const translations: Translations = {
  // Header
  'home': {
    'en': 'Home',
    'hi': 'होम',
  },
  'schemes': {
    'en': 'Schemes',
    'hi': 'योजनाएँ',
  },
  'research': {
    'en': 'Research',
    'hi': 'अनुसंधान',
  },
  'research_description': {
    'en': 'Explore our latest research papers and findings in healthcare innovation.',
    'hi': 'स्वास्थ्य देखभाल नवाचार में हमारे नवीनतम शोध पत्रों और निष्कर्षों का अन्वेषण करें।',
  },
  'search_research': {
    'en': 'Search research papers...',
    'hi': 'शोध पत्र खोजें...',
  },
  'blog': {
    'en': 'Blog',
    'hi': 'ब्लॉग',
  },
  'about': {
    'en': 'About',
    'hi': 'हमारे बारे में',
  },
  'contact': {
    'en': 'Contact',
    'hi': 'संपर्क',
  },
  'login': {
    'en': 'Login',
    'hi': 'लॉगिन',
  },
  'signup': {
    'en': 'Sign Up',
    'hi': 'साइन अप',
  },
  
  // Hero section
  'hero_title': {
    'en': 'Healthcare for Every Indian',
    'hi': 'हर भारतीय के लिए स्वास्थ्य सेवा',
  },
  'hero_subtitle': {
    'en': 'Bridging the healthcare gap in underserved communities',
    'hi': 'असेवित समुदायों में स्वास्थ्य सेवा अंतर को पाटना',
  },
  'get_started': {
    'en': 'Get Started',
    'hi': 'शुरू करें',
  },
  'learn_more': {
    'en': 'Learn More',
    'hi': 'और जानें',
  },
  'govt_certified': {
    'en': 'Govt. Certified',
    'hi': 'सरकारी प्रमाणित',
  },
  'support_24_7': {
    'en': '24/7 Support',
    'hi': '24/7 सहायता',
  },
  'secure_private': {
    'en': 'Secure & Private',
    'hi': 'सुरक्षित और निजी',
  },
  'ai_healthcare_alt': {
    'en': 'AI-powered Healthcare Technology',
    'hi': 'एआई-संचालित स्वास्थ्य सेवा प्रौद्योगिकी',
  },
  'ai_healthcare': {
    'en': 'AI-Powered Healthcare',
    'hi': 'एआई-संचालित स्वास्थ्य सेवा',
  },
  'next_gen_solutions': {
    'en': 'Next-Gen Solutions',
    'hi': 'अगली पीढ़ी के समाधान',
  },
  
  // Services
  'our_services': {
    'en': 'Our Services',
    'hi': 'हमारी सेवाएं',
  },
  'telemedicine': {
    'en': 'Telemedicine',
    'hi': 'टेलीमेडिसिन',
  },
  'health_camps': {
    'en': 'Health Camps',
    'hi': 'स्वास्थ्य शिविर',
  },
  'medicine_delivery': {
    'en': 'Medicine Delivery',
    'hi': 'दवा वितरण',
  },
  'diagnostics': {
    'en': 'Diagnostics',
    'hi': 'नैदानिकी',
  },
  
  // Stats
  'happy_patients': {
    'en': 'Happy Patients',
    'hi': 'खुश मरीज',
  },
  'medical_experts': {
    'en': 'Medical Experts',
    'hi': 'चिकित्सा विशेषज्ञ',
  },
  'hospitals': {
    'en': 'Hospitals',
    'hi': 'अस्पताल',
  },
  'villages_covered': {
    'en': 'Villages Covered',
    'hi': 'कवर किए गए गाँव',
  },
  
  // Impact
  'our_impact': {
    'en': 'Our Impact',
    'hi': 'हमारा प्रभाव',
  },
  'impact_title': {
    'en': 'Making a Difference in Rural Healthcare',
    'hi': 'ग्रामीण स्वास्थ्य सेवा में बदलाव लाना',
  },
  
  // Testimonials
  'testimonials': {
    'en': 'Testimonials',
    'hi': 'प्रशंसापत्र',
  },
  'what_people_say': {
    'en': 'What People Say',
    'hi': 'लोग क्या कहते हैं',
  },
  
  // Newsletter
  'subscribe': {
    'en': 'Subscribe to our Newsletter',
    'hi': 'हमारे न्यूज़लेटर के लिए सदस्यता लें',
  },
  'email_placeholder': {
    'en': 'Enter your email',
    'hi': 'अपना ईमेल दर्ज करें',
  },
  'subscribe_button': {
    'en': 'Subscribe',
    'hi': 'सदस्यता लें',
  },
  
  // Footer
  'rights_reserved': {
    'en': 'All Rights Reserved',
    'hi': 'सर्वाधिकार सुरक्षित',
  },
  
  // About page translations
  'about_title': {
    'en': 'About HealthBridge',
    'hi': 'हेल्थब्रिज के बारे में',
  },
  'about_mission': {
    'en': 'Our Mission',
    'hi': 'हमारा मिशन',
  },
  'about_description': {
    'en': 'HealthBridge is dedicated to transforming healthcare accessibility in India.',
    'hi': 'हेल्थब्रिज भारत में स्वास्थ्य सेवा की पहुंच को बदलने के लिए समर्पित है।',
  },
  
  // Contact page translations
  'contact_title': {
    'en': 'Get in Touch',
    'hi': 'संपर्क करें',
  },
  'contact_description': {
    'en': "Have questions about our services? We're here to help.",
    'hi': 'हमारी सेवाओं के बारे में सवाल हैं? हम मदद के लिए यहां हैं।',
  },
  'send_message': {
    'en': 'Send Message',
    'hi': 'संदेश भेजें',
  },
  'name_placeholder': {
    'en': 'Your Name',
    'hi': 'आपका नाम'
  },
  'email_contact_placeholder': {
    'en': 'Your Email',
    'hi': 'आपका ईमेल'
  },
  'message_placeholder': {
    'en': 'Your Message',
    'hi': 'आपका संदेश'
  },
  'contact_info': {
    'en': 'Contact Information',
    'hi': 'संपर्क जानकारी'
  },
  'address': {
    'en': 'Address',
    'hi': 'पता'
  },
  'phone': {
    'en': 'Phone',
    'hi': 'फोन'
  },
  'email': {
    'en': 'Email',
    'hi': 'ईमेल'
  },

  // Footer translations
  'footer_description': {
    'en': 'Transforming healthcare access for underserved communities across India.',
    'hi': 'भारत भर में वंचित समुदायों के लिए स्वास्थ्य सेवा पहुंच को बदलना।',
  },
  'facebook': {
    'en': 'Facebook',
    'hi': 'फेसबुक',
  },
  'instagram': {
    'en': 'Instagram',
    'hi': 'इंस्टाग्राम',
  },
  'twitter': {
    'en': 'Twitter',
    'hi': 'ट्विटर',
  },
  'quick_links': {
    'en': 'Quick Links',
    'hi': 'त्वरित लिंक',
  },
  'resources': {
    'en': 'Resources',
    'hi': 'संसाधन',
  },
  'faqs': {
    'en': 'FAQs',
    'hi': 'अक्सर पूछे जाने वाले प्रश्न',
  },
  'privacy_policy': {
    'en': 'Privacy Policy',
    'hi': 'गोपनीयता नीति',
  },
  'terms_of_service': {
    'en': 'Terms of Service',
    'hi': 'सेवा की शर्तें',
  },
  'careers': {
    'en': 'Careers',
    'hi': 'करियर',
  },
  'support': {
    'en': 'Support',
    'hi': 'सहायता',
  },
  'footer_address': {
    'en': 'HealthBridge Foundation, 123 Healthcare Way,\nNew Delhi - 110001, India',
    'hi': 'हेल्थब्रिज फाउंडेशन, 123 हेल्थकेयर वे,\nनई दिल्ली - 110001, भारत',
  },
  'privacy': {
    'en': 'Privacy',
    'hi': 'गोपनीयता',
  },
  'terms': {
    'en': 'Terms',
    'hi': 'शर्तें',
  },
  'cookies': {
    'en': 'Cookies',
    'hi': 'कुकीज़',
  },

  // Schemes page translations
  'schemes_title': {
    'en': 'Health Schemes',
    'hi': 'स्वास्थ्य योजनाएं',
  },
  'schemes_description': {
    'en': 'Explore various government health schemes available for citizens across India.',
    'hi': 'भारत भर के नागरिकों के लिए उपलब्ध विभिन्न सरकारी स्वास्थ्य योजनाओं का अन्वेषण करें।',
  },
  'search_schemes': {
    'en': 'Search schemes by name or description...',
    'hi': 'नाम या विवरण से योजनाएं खोजें...',
  },
  'select_category': {
    'en': 'Select category',
    'hi': 'श्रेणी चुनें',
  },
  'all_categories': {
    'en': 'All Categories',
    'hi': 'सभी श्रेणियां',
  },
  'insurance': {
    'en': 'Insurance',
    'hi': 'बीमा',
  },
  'digital_health': {
    'en': 'Digital Health',
    'hi': 'डिजिटल स्वास्थ्य',
  },
  'maternal_health': {
    'en': 'Maternal Health',
    'hi': 'मातृ स्वास्थ्य',
  },
  'child_health': {
    'en': 'Child Health',
    'hi': 'बाल स्वास्थ्य',
  },
  'elderly_care': {
    'en': 'Elderly Care',
    'hi': 'वृद्ध देखभाल',
  },
  'mental_health': {
    'en': 'Mental Health',
    'hi': 'मानसिक स्वास्थ्य',
  },
  'infrastructure': {
    'en': 'Infrastructure',
    'hi': 'अवसंरचना',
  },
  'rural_health': {
    'en': 'Rural Health',
    'hi': 'ग्रामीण स्वास्थ्य',
  },
  'ncd': {
    'en': 'Non-Communicable Diseases',
    'hi': 'गैर-संचारी रोग',
  },
  'vision_care': {
    'en': 'Vision Care',
    'hi': 'दृष्टि देखभाल',
  },
  'hearing_care': {
    'en': 'Hearing Care',
    'hi': 'श्रवण देखभाल',
  },
  'palliative_care': {
    'en': 'Palliative Care',
    'hi': 'पैलिएटिव केयर',
  },
  'dental_care': {
    'en': 'Dental Care',
    'hi': 'दंत देखभाल',
  },
  'eligibility': {
    'en': 'Eligibility',
    'hi': 'पात्रता',
  },
  'benefits': {
    'en': 'Benefits',
    'hi': 'लाभ',
  },
  'active': {
    'en': 'Active',
    'hi': 'सक्रिय',
  },
  'inactive': {
    'en': 'Inactive',
    'hi': 'निष्क्रिय',
  },

  // Home page translations
  'services_description': {
    'en': 'Comprehensive healthcare services designed to meet the needs of every Indian citizen.',
    'hi': 'हर भारतीय नागरिक की जरूरतों को पूरा करने के लिए डिज़ाइन की गई व्यापक स्वास्थ्य सेवाएं।'
  },
  'telemedicine_description': {
    'en': 'Virtual consultations with expert doctors from the comfort of your home.',
    'hi': 'आपके घर के आराम से विशेषज्ञ डॉक्टरों के साथ वर्चुअल परामर्श।'
  },
  'health_camps_description': {
    'en': 'Regular health check-up camps in rural and urban areas.',
    'hi': 'ग्रामीण और शहरी क्षेत्रों में नियमित स्वास्थ्य जांच शिविर।'
  },
  'medicine_delivery_description': {
    'en': 'Fast and reliable medicine delivery to your doorstep.',
    'hi': 'आपके दरवाजे तक तेज और विश्वसनीय दवा वितरण।'
  },
  'diagnostics_description': {
    'en': 'Advanced diagnostic services with quick results.',
    'hi': 'त्वरित परिणामों के साथ उन्नत नैदानिक सेवाएं।'
  },
  'clinical_research': {
    'en': 'Clinical Research',
    'hi': 'नैदानिक अनुसंधान',
  },
  'public_health': {
    'en': 'Public Health',
    'hi': 'सार्वजनिक स्वास्थ्य',
  },
  'biomedical': {
    'en': 'Biomedical',
    'hi': 'बायोमेडिकल',
  },
  'read_paper': {
    'en': 'Read Paper',
    'hi': 'पेपर पढ़ें',
  },
};

// Types for context
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getLanguageLabel: (code: Language) => string;
  availableLanguages: Language[];
  setCustomTranslations: (customTranslations: CustomTranslations) => void;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [customTranslations, setCustomTranslations] = useState<CustomTranslations>(null);

  const t = (key: string): string => {
    // First check if there's a custom translation for this key
    if (customTranslations && customTranslations[key]) {
      return customTranslations[key];
    }
    
    // Otherwise use the regular translations
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || translations[key]['en'] || key;
  };

  const getLanguageLabel = (code: Language): string => {
    return languageLabels[code] || code;
  };

  const availableLanguages: Language[] = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml'];

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    getLanguageLabel,
    availableLanguages,
    setCustomTranslations,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
