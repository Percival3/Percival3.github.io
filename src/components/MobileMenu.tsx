import React, { useState, useEffect } from 'react';
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

  // 当菜单打开时，禁止背景页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* 1. 触发按钮 (汉堡图标) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 2. 全屏菜单覆盖层 */}
      {/* 使用 fixed inset-0 覆盖整个屏幕，z-50 保证在最上层 */}
      <div 
        className={`fixed inset-0 z-[100] bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 h-full flex flex-col">
          {/* 顶部栏：包含关闭按钮 */}
          <div className="h-16 flex items-center justify-end border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 菜单链接列表 */}
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.url}
                onClick={() => setIsOpen(false)} // 点击链接后关闭菜单
                className={`text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }} // 阶梯式动画
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* 底部装饰 */}
          <div className="py-8 text-center text-sm text-gray-400">
            Astro v5 Mobile Navigation
          </div>
        </div>
      </div>
    </div>
  );
}