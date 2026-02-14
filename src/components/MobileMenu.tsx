import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

interface MenuItem {
  name: string;
  url: string;
}

interface Props {
  items: MenuItem[];
}

export default function MobileMenu({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 sm:p-2 text-inherit hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[220] bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl transition-all duration-300 ease-out ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
          >
            <div className="container mx-auto px-4 h-full flex flex-col overflow-y-auto pt-[max(env(safe-area-inset-top),0.75rem)] pb-[max(env(safe-area-inset-bottom),0.75rem)]">
              <div className="h-14 sm:h-16 flex items-center justify-end border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <nav className="flex flex-col items-center justify-center flex-1 gap-6 sm:gap-8 py-6">
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform ${
                      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="py-6 text-center text-xs sm:text-sm text-gray-400">
                Astro v5 Mobile Navigation
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
