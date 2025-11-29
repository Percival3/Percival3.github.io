import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // 我们可以用 lucid 图标

export default function ThemeToggle() {
  // 默认设为 null 以避免服务端渲染(SSR)和客户端渲染不一致导致的 hydration mismatch
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // 组件挂载后，检查当前 html 上是否有 dark 类
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // 1. 切换 state
    setTheme(newTheme);
    
    // 2. 切换 class
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // 3. 存入本地存储
    localStorage.setItem('theme', newTheme);
  };

  // 在客户端 JS 加载完成前，不渲染图标，避免闪烁
  if (theme === null) return <div className="w-9 h-9" />; 

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-600 dark:text-gray-400"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}