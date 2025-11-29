import React, { useState, useEffect } from 'react';

// 这里定义你的全局名言库，不受页面语言切换影响
// 你可以放中文、英文混合，或者任何你喜欢的
const GLOBAL_QUOTES = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "知行合一，止于至善。", author: "王阳明" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "不积跬步，无以至千里。", author: "荀子" }
];

export default function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true); // 开始淡出
      
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % GLOBAL_QUOTES.length);
        setIsAnimating(false); // 切换文字并淡入
      }, 500); // 这里的 500ms 对应 CSS 的 transition duration
      
    }, 4000); // 每 4 秒切换一次

    return () => clearInterval(interval);
  }, []);

  const currentQuote = GLOBAL_QUOTES[index];

  return (
    <div className="h-24 flex flex-col items-center justify-center mb-8 max-w-lg mx-auto">
      <div 
        className={`transition-all duration-500 ease-in-out transform ${
          isAnimating 
            ? 'opacity-0 translate-y-4 scale-95' 
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <blockquote className="text-xl md:text-2xl font-serif italic text-gray-700 dark:text-gray-300 leading-relaxed text-center">
          “{currentQuote.text}”
        </blockquote>
        <div className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest text-center">
          — {currentQuote.author}
        </div>
      </div>
    </div>
  );
}