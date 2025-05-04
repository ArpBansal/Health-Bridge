import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, BarChart2, FileText, Users, Globe, Award, Download, Share2, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Research = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const researchCategories = [
    { value: "all", label: t('all_categories') },
    { value: "clinical", label: t('clinical_research') },
    { value: "public_health", label: t('public_health') },
    { value: "digital_health", label: t('digital_health') },
    { value: "biomedical", label: t('biomedical') }
  ];

  const researchPapers = [
    {
      id: 1,
      title: "Impact of Telemedicine on Rural Healthcare Access",
      authors: "Dr. A. Kumar, Dr. S. Patel, et al.",
      category: "digital_health",
      year: 2024,
      abstract: "A comprehensive study on the effectiveness of telemedicine in improving healthcare access in rural India. The research analyzes patient outcomes, cost-effectiveness, and technological adoption rates across 50 rural healthcare centers.",
      link: "#",
      citations: 45,
      downloads: 120,
      status: "published",
      journal: "Indian Journal of Digital Health"
    },
    {
      id: 2,
      title: "AI in Early Disease Detection",
      authors: "Dr. R. Sharma, Dr. M. Gupta",
      category: "clinical",
      year: 2023,
      abstract: "Exploring the role of artificial intelligence in early detection of chronic diseases. The study presents a novel AI algorithm for predicting diabetes and cardiovascular risks with 92% accuracy.",
      link: "#",
      citations: 78,
      downloads: 210,
      status: "published",
      journal: "Journal of Medical AI Research"
    },
    {
      id: 3,
      title: "Public Health Interventions in Urban Slums",
      authors: "Dr. P. Singh, Dr. A. Das",
      category: "public_health",
      year: 2023,
      abstract: "Analysis of public health interventions and their impact on urban slum communities. The research evaluates the effectiveness of community-based healthcare programs in Mumbai and Delhi.",
      link: "#",
      citations: 32,
      downloads: 95,
      status: "published",
      journal: "Urban Health Journal"
    },
    {
      id: 4,
      title: "Biomedical Innovations in Indian Healthcare",
      authors: "Dr. S. Reddy, Dr. K. Mishra",
      category: "biomedical",
      year: 2024,
      abstract: "Review of recent biomedical innovations and their applications in Indian healthcare. The paper discusses breakthroughs in medical device technology and their implementation in resource-limited settings.",
      link: "#",
      citations: 56,
      downloads: 180,
      status: "published",
      journal: "Indian Biomedical Journal"
    },
    {
      id: 5,
      title: "Digital Health Records: Implementation Challenges",
      authors: "Dr. N. Verma, Dr. T. Joshi",
      category: "digital_health",
      year: 2024,
      abstract: "A study examining the challenges and solutions in implementing digital health records across Indian hospitals. The research provides insights into data security, interoperability, and user adoption.",
      link: "#",
      citations: 28,
      downloads: 150,
      status: "published",
      journal: "Healthcare Informatics Review"
    },
    {
      id: 6,
      title: "Traditional Medicine Integration in Modern Healthcare",
      authors: "Dr. M. Patel, Dr. R. Sharma",
      category: "clinical",
      year: 2023,
      abstract: "Investigating the integration of traditional Indian medicine with modern healthcare practices. The study presents evidence-based approaches to combining Ayurveda with contemporary treatments.",
      link: "#",
      citations: 42,
      downloads: 165,
      status: "published",
      journal: "Integrative Medicine Journal"
    }
  ];

  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: "Total Papers", value: "150+", icon: FileText },
    { label: "Active Researchers", value: "45+", icon: Users },
    { label: "Research Centers", value: "12", icon: Globe },
    { label: "International Collaborations", value: "8", icon: Award }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('research')}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('research_description')}
            </motion.p>
          </div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-healthbridge-blue" />
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('search_research')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('select_category')} />
                </SelectTrigger>
                <SelectContent>
                  {researchCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Research Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{paper.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {paper.authors} • {paper.year}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {paper.journal}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{paper.abstract}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="h-4 w-4" />
                          <span>{paper.citations} citations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Download className="h-4 w-4" />
                          <span>{paper.downloads} downloads</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={paper.link} target="_blank" rel="noopener noreferrer">
                            {t('read_paper')}
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Research; 