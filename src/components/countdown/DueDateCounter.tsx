import { pregnancyInfo } from '../../stores/userStore';
import { Card } from '../shared/Card';

export function DueDateCounter() {
  const info = pregnancyInfo.value;

  if (!info) {
    return (
      <Card className="text-center">
        <p className="text-text-secondary">请先设置预产期</p>
      </Card>
    );
  }

  const progressPercentage = ((280 - info.daysUntilDue) / 280) * 100;

  return (
    <Card className="text-center">
      {/* Main countdown */}
      <div className="mb-6">
        <p className="text-text-secondary text-sm mb-2">距离预产期</p>
        <div className="text-6xl font-black text-primary mb-2">
          {info.daysUntilDue}
        </div>
        <p className="text-text-secondary">天</p>
      </div>

      {/* Progress ring */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="#E5E5E5"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="#58CC02"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-black text-primary">
            {info.weeks}周{info.days}天
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {Math.round(progressPercentage)}%
          </p>
        </div>
      </div>

      {/* Trimester badge */}
      <div className="mb-4">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
          info.trimester === 'early' ? 'bg-blue-100 text-blue-700' :
          info.trimester === 'mid' ? 'bg-green-100 text-green-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {info.trimester === 'early' ? '孕早期' :
           info.trimester === 'mid' ? '孕中期' :
           '孕晚期'}
        </span>
      </div>

      {/* Baby size */}
      <div className="pt-4 border-t-2 border-border">
        <p className="text-text-secondary text-sm mb-2">宝宝现在的大小</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">{info.babySize.emoji}</span>
          <div className="text-left">
            <p className="font-bold text-text-primary">{info.babySize.name}</p>
            {info.babySize.lengthCm && (
              <p className="text-sm text-text-secondary">
                约 {info.babySize.lengthCm} cm
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
