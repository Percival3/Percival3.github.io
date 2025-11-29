import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  rotation?: number; // 樱花专用
  rotationSpeed?: number; // 樱花专用
};

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // 当前模式：'rain' | 'sakura'
    let mode: 'rain' | 'sakura' = document.documentElement.classList.contains('dark') ? 'rain' : 'sakura';

    // 初始化画布尺寸
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // 初始化粒子
    const initParticles = () => {
      particles = [];
      // 粒子数量：樱花少一点(50)，雨多一点(100)
      const count = mode === 'sakura' ? 40 : 120;
      
      for (let i = 0; i < count; i++) {
        resetParticle({}, true);
      }
    };

    // 重置单个粒子（当它跑出屏幕时）
    // randomY: 是否在屏幕中间随机生成（用于初始化），否则从顶部生成
    const resetParticle = (p: Partial<Particle>, randomY = false) => {
      p.x = Math.random() * width;
      p.y = randomY ? Math.random() * height : -10;
      
      if (mode === 'sakura') {
        // 樱花参数
        p.size = Math.random() * 4 + 3; // 大小 3-7
        p.speedY = Math.random() * 1 + 0.5; // 下落速度
        p.speedX = Math.random() * 0.5 - 0.25; // 轻微左右漂移基础值
        p.opacity = Math.random() * 0.5 + 0.3;
        p.rotation = Math.random() * 360;
        p.rotationSpeed = Math.random() * 2 - 1;
      } else {
        // 雨滴参数
        p.size = Math.random() * 2 + 10; // 长度
        p.speedY = Math.random() * 5 + 15; // 极快下落
        p.speedX = -1; //稍微向左下的风
        p.opacity = Math.random() * 0.4 + 0.3;
      }
      
      // 如果不是初始化，且是新的粒子，推入数组
      if (!particles.includes(p as Particle)) {
        particles.push(p as Particle);
      }
    };

    // 绘制樱花瓣 (使用贝塞尔曲线或简单的椭圆)
    const drawSakura = (p: Particle) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation || 0) * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      
      // 绘制一个花瓣形状 (椭圆)
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffc0cb'; // 经典粉色
      ctx.fill();
      
      ctx.restore();
    };

    // 绘制雨滴
    const drawRain = (p: Particle) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.speedX, p.y + p.size);
      ctx.strokeStyle = `rgba(174, 194, 224, ${p.opacity})`; // 蓝灰色
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    // 动画循环
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // 更新位置
        p.y += p.speedY;
        p.x += p.speedX;

        // 樱花特有的摇摆逻辑
        if (mode === 'sakura') {
          p.x += Math.sin(p.y * 0.01) * 0.5; // 正弦波摇摆
          p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
        }

        // 边界检查：如果超出底部或侧边
        if (p.y > height || p.x > width + 20 || p.x < -20) {
          resetParticle(p);
        }

        // 绘制
        if (mode === 'sakura') {
          drawSakura(p);
        } else {
          drawRain(p);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          const newMode = isDark ? 'rain' : 'sakura';
          if (newMode !== mode) {
            mode = newMode;
            initParticles(); // 切换模式时重置粒子
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true, 
      attributeFilter: ['class']
    });

    // 启动
    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }} // 放在背景层之上，内容之下
    />
  );
}