import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, Clock, AlertCircle, Search, Filter, Heart, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "../styles/schemes.css";

const schemes = {
  national: [
    {
      id: 1,
      title: "Ayushman Bharat PM-JAY 2.0",
      description: "Health insurance coverage of ₹7 lakh per family per year for secondary and tertiary care hospitalization.",
      eligibility: "Low income families with annual income below ₹5 lakh",
      benefits: ["Cashless treatment", "Pre-existing conditions covered", "Telemedicine services"],
      validity: "2025-12-31",
      status: "active",
      link: "https://pmjay.gov.in",
      image: "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg",
      category: "insurance"
    },
    {
      id: 2,
      title: "National Digital Health Mission",
      description: "Digital health ecosystem providing unique health IDs and electronic health records.",
      eligibility: "All Indian citizens with Aadhaar card",
      benefits: ["Digital Health ID", "Electronic Health Records", "Teleconsultation"],
      validity: "2025-12-31",
      status: "active",
      link: "https://ndhm.gov.in",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg",
      category: "digital"
    },
    {
      id: 3,
      title: "National Health Mission 2025",
      description: "Healthcare program focusing on maternal, child health, and communicable diseases.",
      eligibility: "All citizens in rural and urban areas",
      benefits: ["Maternal health services", "Child immunization", "Disease control"],
      validity: "2025-12-31",
      status: "active",
      link: "https://nhm.gov.in",
      image: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg",
      category: "general"
    },
    {
      id: 4,
      title: "PM Ayushman Bharat Health Infrastructure Mission",
      description: "Development of healthcare infrastructure including hospitals and medical colleges.",
      eligibility: "All citizens through public healthcare facilities",
      benefits: ["New healthcare facilities", "Upgraded equipment", "Emergency services"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
      category: "infrastructure"
    },
    {
      id: 12,
      title: "PM Surakshit Matritva Abhiyan 2025",
      description: "Maternal health program providing antenatal care and pregnancy management.",
      eligibility: "All pregnant women in India",
      benefits: ["Free antenatal checkups", "High-risk pregnancy management", "Nutritional support"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg",
      category: "maternal"
    },
    {
      id: 15,
      title: "National Telemedicine Service 2025",
      description: "Telemedicine platform connecting patients with healthcare providers.",
      eligibility: "All Indian citizens with internet access",
      benefits: ["Virtual consultations", "E-prescriptions", "Remote monitoring"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg",
      category: "digital"
    },
    {
      id: 16,
      title: "PM Swasthya Suraksha Yojana 2025",
      description: "Health insurance scheme for middle-income families with preventive care focus.",
      eligibility: "Families with annual income between ₹5-10 lakh",
      benefits: ["Preventive health checkups", "Wellness programs", "Emergency care"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg",
      category: "insurance"
    },
    {
      id: 17,
      title: "National Cancer Control Programme 2025",
      description: "Cancer prevention, screening, and treatment program with early detection focus.",
      eligibility: "All Indian citizens",
      benefits: ["Cancer screening", "Treatment support", "Palliative care"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg",
      category: "special"
    },
    {
      id: 18,
      title: "PM Digital Health Records 2025",
      description: "Digital health records system for all citizens with secure access.",
      eligibility: "All Indian citizens with Aadhaar",
      benefits: ["Lifetime health records", "Secure sharing", "Emergency access"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/7089629/pexels-photo-7089629.jpeg",
      category: "digital"
    },
    {
      id: 19,
      title: "National Health Innovation Fund 2025",
      description: "Support for healthcare startups and innovations in medical technology.",
      eligibility: "Healthcare startups and innovators",
      benefits: ["Funding support", "Mentorship", "Market access"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg",
      category: "innovation"
    },
    {
      id: 22,
      title: "National Mental Health Program 2025",
      description: "Comprehensive mental health services and support system.",
      eligibility: "All Indian citizens",
      benefits: ["Mental health counseling", "Psychiatric care", "Rehabilitation services"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
      category: "special"
    },
    {
      id: 23,
      title: "PM Senior Citizen Healthcare Scheme",
      description: "Specialized healthcare program for elderly citizens.",
      eligibility: "Indian citizens above 60 years",
      benefits: ["Geriatric care", "Home healthcare", "Medical equipment support"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/7551674/pexels-photo-7551674.jpeg",
      category: "special"
    }
  ],
  state: [
    {
      id: 5,
      title: "Aarogyasri 2.0 (Telangana)",
      description: "Health insurance scheme with increased coverage and new-age treatments.",
      eligibility: "Below Poverty Line families in Telangana",
      benefits: ["Cashless treatment", "Advanced surgeries", "Cancer treatment"],
      validity: "2025-12-31",
      status: "active",
      link: "https://aarogyasri.telangana.gov.in",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
      category: "insurance"
    },
    {
      id: 6,
      title: "Mahatma Jyotiba Phule Jan Arogya Yojana 2025 (Maharashtra)",
      description: "Healthcare coverage with focus on critical illnesses and specialized treatments.",
      eligibility: "Yellow and orange ration card holders in Maharashtra",
      benefits: ["Free medical treatment", "Specialized surgeries", "Emergency services"],
      validity: "2025-12-31",
      status: "active",
      link: "https://mjpjay.gov.in",
      image: "https://images.pexels.com/photos/668298/pexels-photo-668298.jpeg",
      category: "insurance"
    },
    {
      id: 7,
      title: "Chief Minister's Comprehensive Health Insurance Scheme 2025 (Tamil Nadu)",
      description: "Health coverage with focus on preventive and curative healthcare.",
      eligibility: "Families with annual income less than ₹1.2 lakh in Tamil Nadu",
      benefits: ["Hospitalization coverage", "Diagnostic services", "Surgical procedures"],
      validity: "2025-12-31",
      status: "active",
      link: "https://cmchis.tn.gov.in",
      image: "https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg",
      category: "insurance"
    },
    {
      id: 13,
      title: "Mukhyamantri Amrutam Yojana 2025 (Gujarat)",
      description: "Health insurance scheme for critical illnesses and specialized treatments.",
      eligibility: "Families with annual income less than ₹3 lakh in Gujarat",
      benefits: ["Critical illness coverage", "Organ transplants", "Emergency care"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/127873/pexels-photo-127873.jpeg",
      category: "insurance"
    },
    {
      id: 20,
      title: "Mukhyamantri Chiranjeevi Yojana 2025 (Rajasthan)",
      description: "Health insurance scheme with focus on critical care and specialized treatments.",
      eligibility: "All families in Rajasthan",
      benefits: ["Cashless treatment", "Critical care", "Emergency services"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg",
      category: "insurance"
    },
    {
      id: 21,
      title: "Karunya Arogya Suraksha Padhathi 2025 (Kerala)",
      description: "Comprehensive health coverage for all residents of Kerala.",
      eligibility: "All families in Kerala",
      benefits: ["Universal coverage", "Specialized care", "Wellness programs"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg",
      category: "insurance"
    },
    {
      id: 24,
      title: "Biju Swasthya Kalyan Yojana (Odisha)",
      description: "Universal healthcare coverage for residents of Odisha.",
      eligibility: "All families in Odisha",
      benefits: ["Free treatment", "Cashless services", "Women's health focus"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg",
      category: "insurance"
    },
    {
      id: 25,
      title: "Ayushman Bharat-Mukhyamantri Jan Arogya Yojana (Madhya Pradesh)",
      description: "Extended health coverage for residents of Madhya Pradesh.",
      eligibility: "All families in Madhya Pradesh",
      benefits: ["Enhanced coverage", "Specialized treatments", "Preventive care"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
      category: "insurance"
    }
  ],
  special: [
    {
      id: 8,
      title: "Janani Suraksha Yojana 2025",
      description: "Maternal health program with financial assistance and comprehensive care.",
      eligibility: "Pregnant women from BPL families",
      benefits: ["Cash assistance", "Antenatal care", "Institutional delivery"],
      validity: "2025-12-31",
      status: "active",
      link: "https://nhm.gov.in/jsy",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
      category: "maternal"
    },
    {
      id: 9,
      title: "Rashtriya Bal Swasthya Karyakram 2025",
      description: "Child health screening and early intervention services.",
      eligibility: "All children from birth to 18 years",
      benefits: ["Health screening", "Early intervention", "Growth monitoring"],
      validity: "2025-12-31",
      status: "active",
      link: "https://nhm.gov.in/rbsk",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      category: "child"
    },
    {
      id: 10,
      title: "National Programme for Healthcare of the Elderly 2025",
      description: "Healthcare services for senior citizens with geriatric care focus.",
      eligibility: "All senior citizens above 60 years",
      benefits: ["Geriatric care", "Health monitoring", "Emergency response"],
      validity: "2025-12-31",
      status: "active",
      link: "https://nphce.gov.in",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
      category: "elderly"
    },
    {
      id: 11,
      title: "PM Ayushman Bharat Digital Mission",
      description: "Digital health ecosystem for senior citizens with telemedicine services.",
      eligibility: "Senior citizens above 60 years with valid ID",
      benefits: ["Digital health records", "Teleconsultation", "Emergency response"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      category: "digital"
    },
    {
      id: 14,
      title: "National Mental Health Programme 2025",
      description: "Mental health services with focus on awareness and treatment.",
      eligibility: "All Indian citizens",
      benefits: ["Mental health screening", "Counseling services", "Treatment support"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
      category: "mental"
    },
    {
      id: 26,
      title: "National Programme for Prevention and Control of NCDs 2025",
      description: "Program for prevention and control of non-communicable diseases.",
      eligibility: "All Indian citizens above 30 years",
      benefits: ["Screening services", "Early detection", "Treatment support"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      category: "ncd"
    },
    {
      id: 27,
      title: "National Programme for Control of Blindness 2025",
      description: "Eye care program with focus on prevention and treatment of blindness.",
      eligibility: "All Indian citizens",
      benefits: ["Eye screening", "Treatment support", "Surgery assistance"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
      category: "vision"
    },
    {
      id: 28,
      title: "National Programme for Prevention of Deafness 2025",
      description: "Program for prevention and treatment of hearing impairment.",
      eligibility: "All Indian citizens",
      benefits: ["Hearing screening", "Treatment support", "Hearing aids"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      category: "hearing"
    },
    {
      id: 29,
      title: "National Programme for Palliative Care 2025",
      description: "Palliative care services for patients with life-limiting illnesses.",
      eligibility: "Patients with life-limiting illnesses",
      benefits: ["Pain management", "Symptom control", "Psychological support"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
      category: "palliative"
    },
    {
      id: 30,
      title: "National Programme for Oral Health 2025",
      description: "Oral health program with focus on prevention and treatment.",
      eligibility: "All Indian citizens",
      benefits: ["Dental screening", "Treatment support", "Oral health education"],
      validity: "2025-12-31",
      status: "active",
      link: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      category: "dental"
    }
  ]
};

const SchemePage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredSchemes = Object.entries(schemes).reduce((acc, [category, schemeList]) => {
    const filtered = schemeList.filter(scheme => {
      const matchesSearch = 
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as typeof schemes);

  const categories = [
    { value: "all", label: t('all_categories') },
    { value: "insurance", label: t('insurance') },
    { value: "digital", label: t('digital_health') },
    { value: "maternal", label: t('maternal_health') },
    { value: "child", label: t('child_health') },
    { value: "elderly", label: t('elderly_care') },
    { value: "mental", label: t('mental_health') },
    { value: "infrastructure", label: t('infrastructure') },
    { value: "rural", label: t('rural_health') },
    { value: "ncd", label: t('ncd') },
    { value: "vision", label: t('vision_care') },
    { value: "hearing", label: t('hearing_care') },
    { value: "palliative", label: t('palliative_care') },
    { value: "dental", label: t('dental_care') }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-slate-100 via-healthbridge-light to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-healthbridge-blue to-blue-400">
              {t('schemes_title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('schemes_description')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('search_schemes')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 h-14 rounded-xl border-2 focus:ring-2 focus:ring-healthbridge-blue focus:border-transparent bg-white/80"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[220px] h-14 rounded-xl border-2 hover:border-healthbridge-blue bg-white/80">
                  <SelectValue placeholder={t('select_category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(filteredSchemes).map(([category, schemeList]) => (
              schemeList.map((scheme) => (
                <div key={scheme.id} className="group">
                  <Card className="h-full border-2 bg-white/90 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="relative">
                      <img 
                        src={scheme.image} 
                        alt={scheme.title}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge 
                        variant={scheme.status === "active" ? "default" : "secondary"} 
                        className="absolute top-3 right-3 z-20"
                      >
                        {t(scheme.status)}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-healthbridge-blue transition-colors duration-300 group-hover:text-blue-600">
                        {scheme.title}
                      </CardTitle>
                      <CardDescription>
                        {scheme.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-slate-50/80 via-white/80 to-healthbridge-light/40 rounded-xl p-5">
                          <p className="font-medium text-sm text-gray-700 mb-2">{t('eligibility')}:</p>
                          <p className="text-gray-600 text-sm">{scheme.eligibility}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {scheme.benefits.map((benefit, index) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 p-3 rounded-lg border border-slate-100"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button 
                        asChild
                        className="bg-gradient-to-r from-healthbridge-blue via-blue-500 to-blue-400 hover:opacity-90 transition-opacity duration-300"
                      >
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="gap-2">
                          {t('learn_more')} <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SchemePage;
