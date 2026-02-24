import { route } from 'preact-router';
import { MovementTrend } from '../components/movement/MovementTrend';
import { Button } from '../components/shared/Button';
import { PageLayout } from '../components/layout/PageLayout';

export function Movement() {
  const handleStartCount = () => {
    route('/movement/count');
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">👶</div>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            开始记录胎动
          </h2>
          <Button variant="primary" size="lg" onClick={handleStartCount}>
            开始数胎动
          </Button>
          <p className="text-sm text-text-secondary mt-4">
            💡 建议每天在宝宝活跃时数胎动
          </p>
        </div>

        <MovementTrend />
      </div>
    </PageLayout>
  );
}
