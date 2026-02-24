import { useState, useEffect } from 'preact/hooks';
import { pregnancyInfo } from '../../stores/userStore';
import { Card } from '../shared/Card';

function useCountUp(target: number, duration = 1200, delay = 150) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let raf: number;
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const t = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setCount(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target]);
  return count;
}

export function DueDateCounter() {
  const info = pregnancyInfo.value;
  const [mounted, setMounted] = useState(false);
  const daysCount = useCountUp(info?.daysUntilDue ?? 0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!info) {
    return (
      <Card className="text-center py-8">
        <p className="text-text-secondary">请先设置预产期</p>
      </Card>
    );
  }

  const progressPercentage = ((280 - info.daysUntilDue) / 280) * 100;
  const R = 84;
  const circumference = 2 * Math.PI * R;
  const offset = circumference * (1 - progressPercentage / 100);

  const trimesterMap = {
    early: { label: '孕早期', cls: 'bg-blue-100 text-blue-700' },
    mid:   { label: '孕中期', cls: 'bg-emerald-100 text-emerald-700' },
    late:  { label: '孕晚期', cls: 'bg-orange-100 text-orange-700' },
  } as const;
  const tri = trimesterMap[info.trimester];

  return (
    <Card className="text-center">
      {/* Progress ring */}
      <div className="relative w-56 h-56 mx-auto mb-5">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
          <defs>
            <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle cx="96" cy="96" r={R} stroke="#E5E5E5" strokeWidth="20" fill="none" />

          {/* Progress arc */}
          <circle
            cx="96" cy="96" r={R}
            stroke="#58CC02"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            filter="url(#arcGlow)"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-text-secondary tracking-wide mb-1">距预产期</p>
          <div
            className="text-5xl font-black text-primary leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {daysCount}
          </div>
          <p className="text-text-secondary text-sm font-medium">天</p>
          <p className="text-xs text-text-secondary mt-1" style={{ opacity: 0.55 }}>
            {info.weeks}周{info.days}天 &middot; {Math.round(progressPercentage)}%
          </p>
        </div>
      </div>

      {/* Trimester badge */}
      <div className="mb-4">
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${tri.cls}`}>
          {tri.label}
        </span>
      </div>

      {/* Baby size */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-text-secondary mb-2">宝宝现在的大小</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{info.babySize.emoji}</span>
          <div className="text-left">
            <p className="font-bold text-text-primary text-sm">{info.babySize.name}</p>
            {info.babySize.lengthCm && (
              <p className="text-xs text-text-secondary">约 {info.babySize.lengthCm} cm</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
