'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../app/page.module.css';

// Reusable animated counter component
function CountUp({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function StatsRow() {
  const stats = [
    { value: 14, suffix: "+", label: "Yil bozorda" },
    { value: 10000, suffix: "+", label: "Mamnun mijozlar" },
    { value: 35, suffix: "+", label: "Xil maxsulotlar" },
    { value: 52, suffix: "+", label: "Hamkor kompaniyalar" },
  ];

  const formatValue = (val: number) => val >= 1000 ? Math.floor(val/1000) : val;
  const getSuffix = (val: number, suf: string) => val >= 1000 ? "K" + suf : suf;

  return (
    <div className={styles.statsRow}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.statItem}>
          <div className={styles.statNumber}>
            <CountUp end={formatValue(stat.value)} duration={2500} />
            {getSuffix(stat.value, stat.suffix)}
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
