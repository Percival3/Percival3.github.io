import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';

interface Language {
  code: string;
  label: string;
  url: string;
}

interface Props {
  currentLang: string;
  languages: Language[];
}

export default function LanguageSelector({ currentLang, languages }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前语言的显示标签
  const currentLabel = languages.find(l => l.code === currentLang)?.label || 'Language';

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-sm font-medium text-inherit hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-36 sm:w-40 max-w-[calc(100vw-1rem)] origin-top-left sm:origin-top-right bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200 z-[120]">
          <div className="py-1">
            {languages.map((lang) => (
              <a
                key={lang.code}
                href={lang.url}
                className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{lang.label}</span>
                {currentLang === lang.code && <Check className="w-3.5 h-3.5" />}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
