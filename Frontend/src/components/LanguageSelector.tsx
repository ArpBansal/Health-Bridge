
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage, getLanguageLabel, availableLanguages } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{getLanguageLabel(language)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="flex flex-col space-y-1">
          {availableLanguages.map((lang) => (
            <Button
              key={lang}
              variant="ghost"
              className="flex items-center justify-between"
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
            >
              <span>{getLanguageLabel(lang)}</span>
              {language === lang && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
