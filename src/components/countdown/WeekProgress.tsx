import { pregnancyInfo } from '../../stores/userStore';

export function WeekProgress() {
  const info = pregnancyInfo.value;

  if (!info) return null;

  const milestones = [
    { week: 12, label: '第一次产检' },
    { week: 20, label: '大排畸' },
    { week: 28, label: '孕晚期开始' },
    { week: 37, label: '足月' },
    { week: 40, label: '预产期' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-border">
      <h3 className="text-lg font-bold text-text-primary mb-4">孕期里程碑</h3>

      <div className="relative">
        {/* Timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone) => {
            const isPassed = info.weeks >= milestone.week;
            const isCurrent = info.weeks < milestone.week && info.weeks >= milestone.week - 4;

            return (
              <div key={milestone.week} className="relative flex items-center gap-4 pl-8">
                {/* Dot */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                    isPassed
                      ? 'bg-primary border-primary text-white'
                      : isCurrent
                      ? 'bg-white border-primary text-primary'
                      : 'bg-white border-border text-text-secondary'
                  }`}
                >
                  {isPassed && <span className="text-sm">✓</span>}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`font-bold ${isPassed || isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {milestone.week}周
                  </p>
                  <p className={`text-sm ${isPassed || isCurrent ? 'text-text-secondary' : 'text-gray-400'}`}>
                    {milestone.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
